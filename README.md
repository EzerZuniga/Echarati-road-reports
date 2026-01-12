# ECHARATI ROAD REPORTS

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-2ea44f?style=for-the-badge)

Aplicación web construida con Angular 17 que permite a la ciudadanía reportar incidencias del distrito y hacer seguimiento al proceso de atención municipal. Esta solución prioriza accesibilidad, rendimiento y mantenibilidad para equipos municipales multidisciplinarios.

---

## Tabla de contenidos

1. [Características clave](#características-clave)
2. [Arquitectura y stack](#arquitectura-y-stack)
3. [Comenzar](#comenzar)
4. [Scripts disponibles](#scripts-disponibles)
5. [Configuración de entornos](#configuración-de-entornos)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Modo sin conexión y PWA](#modo-sin-conexión-y-pwa)
8. [Calidad y pruebas](#calidad-y-pruebas)
9. [Guía de contribución](#guía-de-contribución)
10. [Licencia](#licencia)

---

## Características clave

- **Gestión completa de reportes**: creación, actualización, seguimiento y cierre con estados estandarizados (Pendiente, En progreso, Resuelto, Cerrado).
- **Autenticación segura**: módulo dedicado con guards, interceptores y manejo de sesiones persistentes.
- **Experiencia de usuario accesible**: componentes reutilizables, soporte responsive, validaciones de formularios en vivo y patrones de foco visibles.
- **Análisis y priorización**: filtros por categoría y estado, búsqueda contextual y listado paginado para grandes volúmenes de reportes.
- **Integración operativa**: arquitectura modular lista para enlazar servicios REST, mensajería o dashboards analíticos.
- **Resiliencia sin conexión**: PWA habilitada con caché local, cola de sincronización y avisos visuales cuando la red no está disponible.

## Arquitectura y stack

| Capa            | Tecnologías                                      | Descripción                                                          |
| --------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| Frontend        | Angular 17, TypeScript 5.2, RxJS                 | Componentes modulares, lazy loading por dominios y tipado fuerte.    |
| Estilos         | SCSS, CSS Variables                              | Diseño adaptable con estilos globales y aislamiento por componentes. |
| Offline / PWA   | Angular Service Worker, caché local basada en ID | Cacheo de shell, cola diferida y soporte sin conexión.               |
| Infraestructura | Angular CLI, npm o yarn                          | Scripts de construcción, pruebas y linting listos para CI/CD.        |

> La aplicación sigue patrones de arquitectura limpia: `core` concentra servicios base y observabilidad, `shared` expone UI reutilizable y cada dominio (`auth`, `landing`, `reports`) se carga de forma diferida. El módulo `reports` ahora se divide en `components`, `data-access` (API, caché, cola offline), `models` y `services` (fachada reactiva).

## Comenzar

### Requisitos previos

- Node.js 18 LTS o superior (se admite Node 16 pero se recomienda 18).
- npm 9+ o yarn 1.22+.
- Angular CLI 17 instalado globalmente (`npm install -g @angular/cli`).

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/<organizacion>/Echarati-road-reports.git
cd Echarati-road-reports

# 2. Instala dependencias
npm install
# o
# yarn install

# 3. Levanta el servidor de desarrollo
npm start
# o
ng serve --open
```

La aplicación queda disponible por defecto en http://localhost:4200. Si el puerto está ocupado, Angular CLI propondrá uno alternativo.

## Scripts disponibles

| Script           | Descripción                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `npm start`      | Ejecuta `ng serve` con recarga en vivo.                            |
| `npm run build`  | Genera la versión optimizada de producción en `dist/`.             |
| `npm test`       | Corre las pruebas unitarias con Karma/Jasmine.                     |
| `npm run lint`   | Ejecuta el análisis estático configurado.                          |
| `npm run format` | Aplica formateo consistente (si está configurado en package.json). |

## Configuración de entornos

Los valores sensibles y URLs de servicios se definen en:

- `src/environments/environment.ts`: configuraciones para desarrollo.
- `src/environments/environment.prod.ts`: configuraciones de producción.

Crea nuevas variables según sea necesario y accede a ellas mediante la inyección de `EnvironmentInjector` o importando los objetos `environment`. Mantén las claves secretas fuera del repositorio (usa variables de entorno en el servidor CI/CD u orígenes seguros).

## Estructura del proyecto

```
Echarati-road-reports/
├── src/
│   ├── app/
│   │   ├── auth/               # Módulo de autenticación y login
│   │   ├── core/               # Guards, interceptores, servicios base (auth, network)
│   │   ├── landing/            # Página pública de bienvenida
│   │   ├── reports/
│   │   │   ├── components/     # Listado, formulario y detalle de reportes
│   │   │   ├── data-access/    # API REST, caché local, cola offline
│   │   │   ├── models/         # Tipos compartidos
│   │   │   └── services/       # Fachada reactiva para la UI
│   │   └── shared/             # Componentes reutilizables (navbar, footer, banner conectividad)
│   ├── assets/                 # Recursos estáticos
│   ├── environments/           # Configuración por entorno
│   └── styles.scss             # Estilos globales
├── docs/                       # Arquitectura y documentación técnica
├── scripts/                    # Herramientas auxiliares (semillas, etc.)
├── angular.json                # Configuración CLI
├── package.json                # Dependencias y scripts npm
├── tsconfig.json               # Configuración TypeScript raíz
└── README.md                   # Este documento
```

## Modo sin conexión y PWA

La aplicación incluye soporte PWA (`@angular/pwa`) y cola de sincronización para mantener operativa la atención de incidencias aun sin conectividad.

- **Service Worker**: cachea el shell de la app, los estilos y assets críticos en la primera carga (producción).
- **Capa de datos híbrida**: `ReportDataService` decide entre la API (`ReportApiService`) y la caché local (`ReportCacheService`), y mantiene una cola persistente en `localStorage`.
- **Sincronización diferida**: cuando el dispositivo recupera conexión, la cola se reintenta automáticamente. Los reportes se limpian de la bandera `isOfflineEntry` tras confirmación del backend.
- **Feedback visual**: un banner global y badges en lista/formulario/detalle avisan que la sesión está offline.

Cómo probarlo:

1. Ejecuta `npm run build -- --configuration production` y sirve `dist/citizen-reports-angular` con un servidor estático (`npx http-server dist/citizen-reports-angular`).
2. Abre DevTools > Application > Service Workers y activa _Offline_.
3. Crea o edita reportes; verás mensajes de "Sincronización pendiente".
4. Desactiva _Offline_; la cola enviará los cambios y el badge desaparecerá.

## Calidad y pruebas

- **Formato y linting**: ejecuta `npm run lint` antes de enviar cambios. Configura hooks de Git (por ejemplo, Husky) si el equipo lo requiere.
- **Pruebas unitarias**: utiliza `npm test` para validar componentes y servicios con Karma/Jasmine.
- **Buenas prácticas recomendadas**:
  - Mantén componentes presentacionales puros; encapsula lógica de negocio en servicios.
  - Implementa detección de cambios `OnPush` donde sea viable para optimizar rendimiento.
  - Asegura accesibilidad revisando etiquetas ARIA y flujo de tabulación.
  - Simula escenarios offline desde DevTools para validar la cola de sincronización y mensajes.

## Guía de contribución

1. Crea un fork o nueva rama desde `main`.
2. Implementa los cambios siguiendo el estilo del proyecto (SCSS modular, tipado estricto, pruebas asociadas).
3. Ejecuta `npm run lint` y `npm test` antes de abrir un Pull Request.
4. Describe claramente el alcance, adjunta capturas si hay cambios visuales y enlaza issues relacionados.

Para tareas de gran impacto consulta la documentación en `docs/` y alinea tu propuesta con la arquitectura establecida.

## Licencia

Distribuido bajo licencia MIT. Revisa el archivo `LICENSE` para más detalles.
