import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() returnUrl = '/reports';
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
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
    this.error = '';
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.f['username'].value, this.f['password'].value).subscribe({
      next: () => {
        this.close.emit();
        const target = this.returnUrl && this.returnUrl.trim() ? this.returnUrl : '/reports';
        this.router.navigateByUrl(target);
      },
      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
