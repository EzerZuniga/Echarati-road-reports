import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @Output() loggedIn = new EventEmitter<void>();
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';
  readonly highlights: ReadonlyArray<{
    icon: string;
    title: string;
    description: string;
  }> = [
    {
      icon: 'heroShieldCheckSolid',
      title: 'Canal seguro y transparente',
      description: 'Tus reportes viajan cifrados y solo los ven los equipos autorizados.',
    },
    {
      icon: 'heroDocumentMagnifyingGlassSolid',
      title: 'Seguimiento claro',
      description: 'Consulta el estado de cada incidencia con información actualizada.',
    },
    {
      icon: 'heroCheckBadgeSolid',
      title: 'Respuestas verificadas',
      description: 'Cada solución pasa por validación municipal antes de notificarse.',
    },
  ];

  readonly stats: ReadonlyArray<{ value: string; label: string }> = [
    { value: '180+', label: 'Reportes atendidos en el último año' },
    { value: '12', label: 'Equipos municipales coordinados' },
    { value: '24/7', label: 'Recepción de incidencias' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Obtener URL de retorno desde los parámetros de ruta o por defecto '/reports'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/reports';
  }

  // Getter conveniente para acceder a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  // Helper para chequear errores de un control evitando accesos problemáticos en plantillas
  hasError(controlName: string, errorKey: string): boolean {
    const control = this.loginForm.get(controlName);
    if (!control || !control.errors) {
      return false;
    }
    // Usar acceso por índice en TS para claves dinámicas sin usar `any`
    const errors = control.errors as Record<string, unknown> | null;
    return !!(errors && errors[errorKey] !== undefined && errors[errorKey] !== null);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.f['username'].value, this.f['password'].value).subscribe({
      next: () => {
        this.loggedIn.emit();
        this.router.navigate([this.returnUrl]);
      },
      error: (_err) => {
        this.error = 'Usuario o contraseña incorrectos';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
