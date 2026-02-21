import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
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

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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
    this.cdr.markForCheck();
    this.error = '';
    this.cdr.markForCheck();
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.cdr.markForCheck();
    this.authService.login(this.f['username'].value, this.f['password'].value).subscribe({
      next: () => {
        this.loading = false;
        this.close.emit();
        const target = this.returnUrl && this.returnUrl.trim() ? this.returnUrl : '/reports';
        this.router.navigateByUrl(target);
        this.cdr.markForCheck();
      },
      error: (err: Error) => {
        this.error = err.message || 'Credenciales inválidas';
        this.loading = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
