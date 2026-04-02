import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DniService } from '../../../core/services/dni.service';

function dniValidator(): ValidatorFn {
  return (ctrl: AbstractControl) => {
    const val: string = ctrl.value ?? '';
    return /^\d{8}$/.test(val) ? null : { invalidDni: true };
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  hidePassword = true;
  dniLoading = false;
  dniVerified = false;
  dniError = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar,
    private dniService: DniService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      dni: ['', [Validators.required, dniValidator()]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
    });

    // Auto-consulta RENIEC cuando el DNI tiene 8 dígitos
    this.form
      .get('dni')!
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(400),
        distinctUntilChanged(),
        filter((val: string) => /^\d{8}$/.test(val)),
        switchMap((dni: string) => {
          this.dniLoading = true;
          this.dniVerified = false;
          this.dniError = false;
          return this.dniService.lookup(dni);
        })
      )
      .subscribe((res) => {
        this.dniLoading = false;
        if (res) {
          this.dniVerified = true;
          this.form.patchValue({
            firstName: res.nombres,
            lastName: `${res.apellidoPaterno} ${res.apellidoMaterno}`,
          });
        } else {
          this.dniError = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.auth
      .register(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snack.open('Cuenta creada exitosamente', 'OK', { duration: 3000 });
          this.router.navigate(['/reports']);
        },
        error: (err: Error) => {
          this.loading = false;
          this.snack.open(err.message, 'Cerrar', { duration: 4000, panelClass: 'snack-error' });
        },
      });
  }
}
