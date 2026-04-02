## Arquitectura de la aplicación

Este documento describe la arquitectura base del proyecto, sus decisiones de diseño clave y los lineamientos operativos para garantizar mantenibilidad, seguridad y escalabilidad.

### Principios rectores

- Modularidad explícita: `core` concentra singletons; `shared` expone únicamente UI reutilizable; los módulos de dominio se cargan de forma perezosa.
- Seguridad por defecto: TypeScript estricto, templates estrictos, auditoría de dependencias, tratamientos homogéneos de autenticación y autorización.
- Observabilidad y resiliencia: se centraliza el manejo de errores, métricas y logging para evitar puntos ciegos.
- Entregas confiables: la automatización cubre lint, pruebas, build y despliegue para asegurar reproducibilidad.

### Stack tecnológico

- Angular 17 (standalone components deshabilitados por consistencia con Angular Modules).
- TypeScript con `strict` y `strictTemplates` habilitados.
- Router de Angular con guards y lazy loading.
- Karma + Jasmine para unit tests; Cypress recomendado para E2E.
- Prettier + ESLint para formato y estilo.
- Node 18 LTS; npm para gestión de dependencias.

### Mapa de módulos

- `AppModule`: raíz de la aplicación; importa `CoreModule`, `SharedModule`, `MaterialModule` y `LayoutsModule`; declara `AppComponent` y configura el router con lazy loading.
- `CoreModule`: servicios singleton (`AuthService`, `NetworkService`, `ReportApiService`), interceptores (`AuthInterceptor`), guards (`authGuard`, `roleGuard`), error handler global y utilidades centralizadas (`report-labels`). Solo `AppModule` debe importarlo.
- `SharedModule`: componentes reutilizables (navbar, footer, banner de conectividad, login modal) y módulos de formulario (FormsModule, ReactiveFormsModule); no define providers.
- `MaterialModule`: centraliza las importaciones de Angular Material para evitar repetición.
- `LayoutsModule`: layouts de aplicación (`MainLayoutComponent`, `AdminLayoutComponent`) usados como wrappers en las rutas.
- **Feature modules** (todos lazy-loaded):
  - `LandingModule` (`features/landing/`): página pública con contenido institucional, FAQ, y páginas legales.
  - `AuthModule` (`features/auth/`): flujo de autenticación (login con email y Google Sign-In, registro).
  - `ReportsModule` (`features/reports/`): CRUD de reportes ciudadanos (listado, formulario, detalle).
  - `AdminModule` (`features/admin/`): dashboard de métricas y gestión de reportes con tabla Material.

### Flujo de ejecución

1. `main.ts` arranca `AppModule` y configura global error handler.
2. `AppRoutingModule` usa lazy loading para todos los feature modules; rutas privadas protegidas por `authGuard`, rutas de admin protegidas adicionalmente por `roleGuard`.
3. Los componentes de features interactúan con `ReportApiService` (singleton en `core`) para operaciones CRUD.
4. Las respuestas se mapean a modelos tipados (`Report`, `DashboardMetrics`) definidos en `core/models`.

### Organización de carpetas

```
src/app/
├── core/                    # Singletons: services, guards, interceptors, models, utils
│   ├── guards/              # authGuard, roleGuard (functional guards)
│   ├── handlers/            # GlobalErrorHandler
│   ├── interceptors/        # AuthInterceptor (JWT + refresh token)
│   ├── models/              # Interfaces y tipos del dominio (Report, User, etc.)
│   ├── services/            # AuthService, NetworkService, ReportApiService
│   └── utils/               # Utilidades centralizadas (report-labels: labels, colores, opciones)
├── shared/                  # Componentes UI reutilizables sin lógica de dominio
│   ├── components/          # navbar, footer, connectivity-banner, login-modal
│   ├── shared.module.ts     # Re-exporta CommonModule, RouterModule, FormsModule
│   └── material.module.ts   # Centraliza imports de Angular Material
├── layouts/                 # Wrappers de layout para rutas
│   ├── main-layout/         # Layout para usuarios autenticados
│   └── admin-layout/        # Layout con sidenav para administradores
├── features/                # Feature modules (lazy-loaded)
│   ├── landing/             # Página pública + páginas legales
│   ├── auth/                # Login + Registro (email y Google)
│   ├── reports/             # CRUD de reportes ciudadanos
│   │   └── pages/           # report-list, report-form, report-detail
│   └── admin/               # Panel administrativo
│       └── pages/           # dashboard, reports-management
├── app.module.ts            # Módulo raíz
├── app-routing.module.ts    # Configuración de rutas con lazy loading
└── app.component.ts         # Componente raíz
```

- `src/assets`: recursos estáticos (logos, favicons, imágenes).
- `src/environments`: configuración por entorno; `environment.ts` para desarrollo, `environment.prod.ts` para producción.
- `scripts`: utilidades de desarrollo (por ejemplo, `seed-sample.mjs`).

### Comunicación con API

- La URL base se obtiene de `environment.apiUrl` para no acoplar endpoints en código.
- `AuthInterceptor` implementa `HttpInterceptor` para inyectar cabeceras `Authorization: Bearer` y manejar la renovación automática de tokens ante 401.
- `ReportApiService` (en `core/services`) encapsula todas las llamadas REST de reportes: `getAll`, `getMine`, `getById`, `create`, `updateStatus`, `delete`, `getDashboard`.
- Las utilidades de etiquetas y opciones de formulario están centralizadas en `core/utils/report-labels.ts` para evitar duplicación entre componentes.

### Autenticación y autorización

- El token se conserva en `localStorage` mediante `AuthService`; evaluar uso de cookies HttpOnly + CSRF si el backend lo soporta.
- `AuthGuard` verifica autenticación previa a rutas privadas; ante expiración, redirige a login y limpia credenciales.
- Considerar la incorporación de `refresh tokens` y políticas de cierre de sesión remoto para reducir riesgo de secuestro de sesión.

### Manejo de errores y observabilidad

- `ErrorHandler` personalizado en `CoreModule` para centralizar logging; conectar con Sentry, Datadog o Application Insights en producción.
- Establecer trazas mínimas: identificación de usuario (cuando aplique), ruta, payload resumido y respuesta del backend.
- Configurar `window.onerror`/`unhandledrejection` desde `main.ts` para capturar errores globales.

### Gestión de estado

- Los componentes de features consumen directamente `ReportApiService` para operaciones CRUD, manteniendo el estado local en cada componente.
- `AuthService` mantiene el estado de sesión como singleton (usuario actual, tokens) con observables reactivos.
- `NetworkService` expone un observable global de conectividad que alimenta al banner de conectividad.
- Si el volumen de estado compartido crece, migrar a NgRx o ComponentStore, reutilizando `ReportApiService` como capa de datos.

### Estrategia de pruebas

- Unit tests obligatorios para servicios (`AuthService`, `ReportApiService`), guards (`authGuard`, `roleGuard`) e interceptores (`AuthInterceptor`).
- Componentes críticos (formularios) deben incluir pruebas de template y validaciones.
- Integrar cobertura mínima del 80 % en el pipeline; fallar el build si se reduce.
- Cypress (o Playwright) para flujos de extremo a extremo: login, creación de reporte, gestión admin, logout.

### Calidad y automatización

- Flujo de CI recomendado:
  1. `npm ci` (instalación limpia).
  2. `npm run lint`.
  3. `npm test -- --watch=false --browsers=ChromeHeadless`.
  4. `npm run build -- --configuration production`.
- Agregar auditoría de dependencias (`npm audit`, `npm run lint:security` si se integra `eslint-plugin-security`).
- En PRs, exigir revisiones cruzadas y reportes de cobertura.

### Soporte offline y PWA

- `@angular/service-worker` queda habilitado para builds de producción; el `ngsw-config.json` precachea el shell y assets.
- `ReportCacheService` utiliza `localStorage` como fallback universal. En despliegues productivos se recomienda migrar a IndexedDB (por ejemplo, `idb`) si el volumen de datos crece.
- `ReportDataService` mantiene una cola persistente; cada operación incluye `pendingAction` para mostrar mensajes en la UI mientras espera sincronización.
- `NetworkService` expone un observable global de conectividad; `ConnectivityBannerComponent` y la UI de reportes reaccionan a los cambios.
- Al reconectar, `flushQueue()` reintenta las operaciones y limpia las banderas locales tras respuesta satisfactoria.

### Gestión de configuraciones y secretos

- `environment*.ts` únicamente para valores no sensibles (URLs, feature flags).
- Variables secretas (tokens, claves API) deben residir en el gestor de secretos del entorno (Azure Key Vault, GitHub Actions secrets, etc.).
- Documentar en README las variables requeridas y su origen.

### Despliegue y entornos

- Builds de producción se generan con `npm run build -- --configuration production`; el resultado se hospeda en servicios estáticos (Azure Static Web Apps, S3+CloudFront, etc.).
- Preproducción debe replicar el pipeline de producción y apuntar a APIs staging.
- Automatizar invalidación de CDN tras cada despliegue para evitar contenido obsoleto.

### Operación y monitoreo

- Configurar health checks simples (por ejemplo, ruta `/health`) en el backend y monitorearlos desde la UI para notificar indisponibilidades.
- Añadir métricas de UX: tiempos de carga, errores por tipo, eventos de usuario relevantes.
- Definir un playbook de incidentes con pasos para rollback y contacto de responsables.

### Desarrollo local

- `npm start` inicia servidor en modo watch.
- `npm run start:hmr` puede habilitarse si se requiere feedback inmediato (habilitar HMR en `webpack.config` si no está listo).
- `node scripts/seed-sample.mjs --count N` genera datos de prueba sincronizados con el backend.

### Roadmap técnico sugerido

1. Incorporar manejo de refresh token y expiración proactiva en `AuthService`.
2. Crear pruebas E2E mínimas (login + creación de reporte) y automatizarlas en CI nocturno.
3. Integrar herramienta de observabilidad (Sentry o similar) con dashboard y alertas configuradas.
4. Evaluar migración a Jest para reducir tiempos de ejecución y simplificar mocks.
