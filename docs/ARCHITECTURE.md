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

- `AppModule`: raíz de la aplicación; importa `CoreModule` y `SharedModule`; declara `AppComponent` y configura el router.
- `CoreModule`: servicios singleton (`AuthService`, interceptores, guards). Solo `AppModule` debe importarlo para evitar duplicados.
- `SharedModule`: componentes reutilizables (navbar, footer, modales) y pipes/directivas puras; no define providers.
- `AuthModule`: flujo de autenticación (login, guards específicos). Se carga perezosamente.
- `ReportsModule`: catálogo de reportes, formularios y vistas detalle. Carga perezosa desde `reports-routing.module.ts`.
- `LandingModule`: página pública inicial con contenido estático y CTA hacia login/registros.

### Flujo de ejecución

1. `main.ts` arranca `AppModule` y configura global error handler.
2. `AppRoutingModule` decide entre rutas públicas (landing) y privadas (reports) usando `AuthGuard`.
3. Una vez autenticado, `ReportsModule` consume la API mediante `ReportService`, almacenando estado ligero en servicios (sin NgRx por simplicidad actual).
4. Las respuestas se mapean a modelos tipados (`Report`), que se reutilizan en formularios y vistas.

### Organización de carpetas

- `src/app/core`: integraciones transversales (auth, interceptors, guards). Aquí residen adaptadores a infraestructura externa.
- `src/app/shared`: librería interna de componentes UI parametrizables, sin acoplamientos al dominio.
- `src/app/auth` y `src/app/reports`: módulos de dominio con sus propios routing modules, componentes y servicios.
- `src/app/landing`: presentación inicial, sin dependencias de autenticación.
- `src/assets`: recursos estáticos (logos, favicons, estilos globales).
- `src/environments`: configuración por entorno; `environment.ts` para desarrollo, `environment.prod.ts` para producción.
- `scripts`: utilidades de desarrollo (por ejemplo, `seed-sample.js`).

### Comunicación con API

- La URL base se obtiene de `environment.apiUrl` para no acoplar endpoints en código.
- `AuthInterceptor` extiende `HttpInterceptor` para inyectar cabeceras de autenticación y procesar códigos de error.
- `ReportService` encapsula todas las llamadas al backend y devuelve `Observable<Report[]>` o `Observable<Report>` según corresponda.
- Se recomienda añadir un `HttpErrorHandlerService` para traducir errores técnicos en mensajes de negocio y centralizar la captura de métricas.

### Autenticación y autorización

- El token se conserva en `localStorage` mediante `AuthService`; evaluar uso de cookies HttpOnly + CSRF si el backend lo soporta.
- `AuthGuard` verifica autenticación previa a rutas privadas; ante expiración, redirige a login y limpia credenciales.
- Considerar la incorporación de `refresh tokens` y políticas de cierre de sesión remoto para reducir riesgo de secuestro de sesión.

### Manejo de errores y observabilidad

- `ErrorHandler` personalizado en `CoreModule` para centralizar logging; conectar con Sentry, Datadog o Application Insights en producción.
- Establecer trazas mínimas: identificación de usuario (cuando aplique), ruta, payload resumido y respuesta del backend.
- Configurar `window.onerror`/`unhandledrejection` desde `main.ts` para capturar errores globales.

### Gestión de estado

- Actualmente se usa un enfoque service-with-observable; suficiente mientras el dominio sea simple.
- Si el volumen de estados compartidos crece, adoptar NgRx o Akita para trazabilidad y devtools integrados.

### Estrategia de pruebas

- Unit tests obligatorios para servicios (`AuthService`, `ReportService`), guards (`AuthGuard`) e interceptores (`AuthInterceptor`).
- Componentes críticos (formularios) deben incluir pruebas de template y validaciones.
- Integrar cobertura mínima del 80 % en el pipeline; fallar el build si se reduce.
- Cypress (o Playwright) para flujos extremos a extremo: login, creación/edición de reporte, logout.

### Calidad y automatización

- Flujo de CI recomendado:
  1. `npm ci` (instalación limpia).
  2. `npm run lint`.
  3. `npm test -- --watch=false --browsers=ChromeHeadless`.
  4. `npm run build -- --configuration production`.
- Agregar auditoría de dependencias (`npm audit`, `npm run lint:security` si se integra `eslint-plugin-security`).
- En PRs, exigir revisiones cruzadas y reportes de cobertura.

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
- `node scripts/seed-sample.js --count N` genera datos de prueba sincronizados con el backend.

### Roadmap técnico sugerido

1. Incorporar manejo de refresh token y expiración proactiva en `AuthService`.
2. Crear pruebas E2E mínimas (login + creación de reporte) y automatizarlas en CI nocturno.
3. Integrar herramienta de observabilidad (Sentry o similar) con dashboard y alertas configuradas.
4. Evaluar migración a Jest para reducir tiempos de ejecución y simplificar mocks.
