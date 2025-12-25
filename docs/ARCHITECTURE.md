# Arquitectura - citizen-reports-angular

Resumen breve de la arquitectura y decisiones importantes.

- Framework: Angular 17
- TypeScript: Strict mode activado en `tsconfig.json`
- Tests: Karma + Jasmine para unit tests

Estructura recomendada:

- `src/` : código de la aplicación
- `e2e/` : pruebas end-to-end (Cypress/Playwright)
- `docs/` : documentación técnica y diagramas
- `infra/` : plantillas de despliegue e IaC
- `mocks/` : fixtures y datos de prueba

Decisiones claves:
- Se activaron las comprobaciones estrictas de TS y Angular para evitar errores en tiempo de ejecución.
- Se recomienda CI para ejecutar lint/tests/build en cada PR.
