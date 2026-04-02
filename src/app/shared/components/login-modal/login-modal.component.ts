import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Input() returnUrl = '/reports';
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // close on backdrop click handled in template

  onCloseRequest() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close.emit();
  }

  onLoggedIn() {
    this.close.emit();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      this.cdr.markForCheck();
      return;
    }
    this.loading = true;
    this.cdr.markForCheck();
    this.authService
      .login({ email: this.f['username'].value, password: this.f['password'].value })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.close.emit();
          const target = this.isSafeUrl(this.returnUrl) ? this.returnUrl : '/reports';
          this.router.navigateByUrl(target);
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          this.error = err.message || 'Credenciales inválidas';
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  private isSafeUrl(url: string): boolean {
    return !!url && url.startsWith('/') && !url.startsWith('//');
  }
}
