import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() loggedIn = new EventEmitter<void>();
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno desde los parámetros de ruta o por defecto '/reports'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/reports';
  }

  // Getter conveniente para acceder a los controles del formulario
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    
    this.authService.login(
      this.f['username'].value, 
      this.f['password'].value
    ).subscribe({
      next: () => {
        // Emit event for embedded usages (modals)
        try { this.loggedIn.emit(); } catch {}
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}