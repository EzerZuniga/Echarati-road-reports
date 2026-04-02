import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '@env/environment';

declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (r: { credential: string }) => void;
      }) => void;
      renderButton: (el: HTMLElement, opts: object) => void;
    };
  };
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('googleBtn', { static: false }) googleBtnRef?: ElementRef<HTMLElement>;
  form!: FormGroup;
  loading = false;
  hidePassword = true;
  private destroy$ = new Subject<void>();
  private returnUrl = '/reports';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    const rawUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/reports';
    this.returnUrl = this.isSafeUrl(rawUrl) ? rawUrl : '/reports';
    this.initGoogleSignIn();
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
      .login({ email: this.f['email'].value, password: this.f['password'].value })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const dest = res.user.role === 'admin' ? '/admin/dashboard' : this.returnUrl;
          this.router.navigateByUrl(dest);
        },
        error: (err: Error) => {
          this.loading = false;
          this.snack.open(err.message, 'Cerrar', { duration: 4000, panelClass: 'snack-error' });
        },
      });
  }

  private initGoogleSignIn(): void {
    if (typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: { credential: string }) => {
        this.auth
          .loginWithGoogle({ idToken: response.credential })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              const dest = res.user.role === 'admin' ? '/admin/dashboard' : this.returnUrl;
              this.router.navigateByUrl(dest);
            },
            error: (err: Error) => {
              this.snack.open(err.message, 'Cerrar', { duration: 4000, panelClass: 'snack-error' });
            },
          });
      },
    });
    const btn = this.googleBtnRef?.nativeElement ?? document.getElementById('google-signin-btn');
    if (btn) {
      google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large', width: 320 });
    }
  }

  private isSafeUrl(url: string): boolean {
    return !!url && url.startsWith('/') && !url.startsWith('//');
  }
}
