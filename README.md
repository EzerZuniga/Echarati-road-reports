# Citizen Reports - Sistema de Gestión de Reportes Ciudadanos

![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Design-00C7B7?style=for-the-badge)

Sistema web completo para la gestión de reportes ciudadanos, desarrollado con Angular 17. Permite a los ciudadanos reportar problemas en la comunidad y seguir su estado de resolución.

## 🌟 Características Principales

### 🔐 **Autenticación Segura**
- Sistema de login con validaciones
- Gestión de sesiones persistente
- Protección de rutas con guards
- Logout seguro

### 📋 **Gestión Completa de Reportes**
- **CRUD completo**: Crear, Leer, Actualizar, Eliminar reportes
- **Categorización**: Infraestructura, Seguridad, Medio Ambiente, Transporte, Otros
- **Estados de seguimiento**: Pendiente, En Progreso, Resuelto, Cerrado
- **Filtros avanzados**: Por categoría, estado, fecha y ubicación
- **Búsqueda inteligente**: En títulos, descripciones y ubicaciones

### 🎨 **Experiencia de Usuario**
- **Diseño responsive** para móviles, tablets y desktop
- **Interfaz moderna** con componentes reutilizables
- **Validación en tiempo real** de formularios
- **Feedback visual** con badges y alerts
- **Paginación** para listas extensas
- **Estados de carga** con spinners

### 🏗️ **Arquitectura Profesional**
- **Modularidad**: Separación por funcionalidades
- **Lazy Loading**: Optimización de carga inicial
- **Servicios centralizados**: Lógica de negocio reutilizable
- **Componentes puros**: Separación de responsabilidades
- **Tipado fuerte** con TypeScript

## 📁 Estructura del Proyecto
citizen-reports-angular/
├── src/
│ ├── app/
│ │ ├── auth/ # Módulo de autenticación
│ │ │ ├── login/ # Componente de login
│ │ │ ├── auth-routing.module.ts # Rutas de auth
│ │ │ └── auth.module.ts # Módulo de auth
│ │ │
│ │ ├── core/ # Núcleo de la aplicación
│ │ │ ├── guards/ # Guards de autenticación
│ │ │ ├── services/ # Servicios centrales
│ │ │ └── core.module.ts # Módulo core
│ │ │
│ │ ├── reports/ # Módulo de reportes
│ │ │ ├── components/ # Componentes de reportes
│ │ │ ├── models/ # Modelos e interfaces
│ │ │ ├── services/ # Servicios de reportes
│ │ │ ├── reports-routing.module.ts
│ │ │ └── reports.module.ts
│ │ │
│ │ ├── shared/ # Componentes compartidos
│ │ │ ├── components/ # Navbar, Footer
│ │ │ └── shared.module.ts
│ │ │
│ │ ├── app-routing.module.ts # Rutas principales
│ │ ├── app.component.* # Componente raíz
│ │ └── app.module.ts # Módulo principal
│ │
│ ├── assets/ # Recursos estáticos
│ ├── styles.scss # Estilos globales
│ └── index.html # HTML principal
│
├── angular.json # Configuración de Angular
├── package.json # Dependencias y scripts
├── tsconfig.json # Configuración TypeScript
└── README.md # Este archivo

text

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js 16+** (Recomendado: 18 LTS)
- **npm 8+** o **yarn 1.22+**
- **Angular CLI 17+**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd citizen-reports-angular
Instalar dependencias

bash
npm install
# o con yarn
yarn install
Verificar instalación

bash
ng version
# Debería mostrar Angular CLI: 17.x.x
Ejecutar la aplicación en desarrollo

bash
npm start
# o
ng serve
Abrir en el navegador

text
http://localhost:4200
📊 Scripts Disponibles
Comando	Descripción
npm start	Inicia el servidor de desarrollo en localhost:4200
npm run build	Construye la aplicación para producción en dist/
npm run watch	Construye y observa cambios para desarrollo
npm test	Ejecuta pruebas unitarias
npm run lint	Ejecuta análisis estático de código
🔧 Configuración de Desarrollo
Estructura de Componentes
Cada componente sigue la convención de Angular:

text
component-name/
├── component-name.component.ts      # Lógica del componente
├── component-name.component.html    # Template HTML
├── component-name.component.scss    # Estilos SCSS
└── component-name.component.spec.ts # Pruebas unitarias (opcional)
Servicios
Los servicios están organizados por funcionalidad:

AuthService: Manejo de autenticación y sesiones

ReportService: Operaciones CRUD para reportes

Modelos
typescript
// Ejemplo de modelo
export interface Report {
  id: number;
  title: string;
  description: string;
  category: ReportCategory;
  location: string;
  status: ReportStatus;
  createdAt: Date;
  // ... más propiedades
}
👤 Credenciales de Acceso
Para acceder al sistema, utiliza las siguientes credenciales:

Campo	Valor
Usuario	admin
Contraseña	password123
Nota: Estas son credenciales de demostración. En producción, implementa un sistema de autenticación real.

📱 Funcionalidades Detalladas
1. Autenticación
Login seguro con validación de formularios

Persistencia de sesión usando localStorage

Protección de rutas: solo usuarios autenticados pueden acceder a reportes

Logout que limpia todas las credenciales

2. Dashboard de Reportes
Vista de lista con paginación

Filtros combinables por múltiples criterios

Búsqueda en tiempo real

Visualización de estado con badges coloridos

Acciones rápidas (ver, editar, eliminar)

3. Creación de Reportes
Formulario validado en tiempo real

Categorías predefinidas con iconos

Ubicación detallada con coordenadas opcionales

Descripción enriquecida con contador de caracteres

4. Detalle de Reportes
Vista completa de toda la información

Historial de creación y actualización

Gestión de estado con botones de acción

Acciones contextuales (editar, eliminar)

5. Gestión de Estado
text
PENDIENTE     → En espera de revisión
EN PROGRESO   → Equipo trabajando en solución
RESUELTO      → Problema solucionado
CERRADO       → Reporte finalizado
🎨 Estilos y Diseño
Framework de Estilos
SCSS como preprocesador CSS

Variables CSS para colores y espaciados

Mixins para funcionalidades reutilizables

Responsive design con media queries

Sistema de Colores
scss
// Colores principales
$primary: #4a90e2;
$success: #28a745;
$warning: #ffc107;
$danger: #dc3545;
$info: #17a2b8;
Breakpoints Responsive
scss
// Mobile First
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
🔒 Seguridad
Medidas Implementadas
Validación de formularios en frontend

Protección de rutas con AuthGuard

Sanitización de inputs

Manejo seguro de tokens (en localStorage para demo)

Para Producción
Recomendaciones adicionales:

Implementar autenticación JWT real

Usar HttpInterceptor para agregar tokens

Implementar refresh tokens

Agregar CSRF protection

Usar environment variables para configuraciones sensibles

📦 Despliegue
Build para Producción
bash
npm run build -- --configuration=production
Configuraciones de Build
Minificación de HTML, CSS y JavaScript

Tree shaking para eliminar código no usado

Ahead-of-Time (AOT) compilation

Optimización de bundles

Plataformas de Despliegue
Vercel: vercel --prod

Netlify: netlify deploy --prod

Firebase Hosting: firebase deploy

AWS S3 + CloudFront: Subir contenido de dist/

🧪 Testing
Pruebas Unitarias
bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con coverage
ng test --code-coverage
Linting y Code Quality
bash
# Analizar código
npm run lint

# Formatear código (si se configura Prettier)
npm run format
🔄 Actualización de Dependencias
bash
# Verificar actualizaciones
npm outdated

# Actualizar Angular CLI globalmente
npm install -g @angular/cli@latest

# Actualizar dependencias del proyecto
ng update
🤝 Contribución
Guía de Contribución
Fork el proyecto

Crear una rama para tu feature (git checkout -b feature/AmazingFeature)

Commit tus cambios (git commit -m 'Add some AmazingFeature')

Push a la rama (git push origin feature/AmazingFeature)

Abrir un Pull Request

Convenciones de Código
TypeScript: Usar tipos explícitos

Nombres: camelCase para variables, PascalCase para clases

Comentarios: Documentar funciones complejas

Commits: Mensajes descriptivos en inglés

📚 Recursos y Referencias
Documentación Oficial
Angular Documentation

TypeScript Handbook

RxJS Documentation

Tutoriales Relacionados
Angular Forms

Angular Routing

Angular Services

🐛 Solución de Problemas
Problemas Comunes
Error de TypeScript

bash
# Limpiar cache
npm cache clean --force
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
Servidor no inicia

bash
# Verificar puerto
ng serve --port 4200
# Verificar que no haya procesos en el puerto
lsof -ti:4200 | xargs kill -9
Errores de build

bash
# Limpiar cache de Angular
ng cache clean
# Reconstruir
npm run build
Debugging
Usar console.log() con moderación

Chrome DevTools para debugging de Angular

Redux DevTools para estado de la aplicación

📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

👥 Contacto y Soporte
Reportar Issues
Si encuentras algún bug o tienes una sugerencia:

Verifica que no haya un issue similar ya reportado

Usa la plantilla de issues correspondiente

Proporciona información detallada y pasos para reproducir

Preguntas Frecuentes
Q: ¿Puedo usar este proyecto para mi ciudad/municipio?
R: Sí, este proyecto es open source y puedes adaptarlo a tus necesidades.

Q: ¿Cómo agrego nuevas categorías de reportes?
R: Modifica el enum ReportCategory en src/app/reports/models/report.model.ts

Q: ¿Cómo conecto con un backend real?
R: Modifica los servicios (ReportService, AuthService) para hacer peticiones HTTP reales.

Q: ¿Es seguro para producción?
R: Como demo es funcional, pero para producción necesitas:

Backend real con autenticación

Base de datos

Configuraciones de seguridad adicionales

✨ Características Técnicas Avanzadas
Performance
Lazy Loading: Módulos cargados bajo demanda

Change Detection: Estrategia OnPush donde aplicable

Memoization: Cache de operaciones costosas

Virtual Scrolling: Para listas muy grandes (pendiente)

Accesibilidad (A11y)
ARIA labels en elementos interactivos

Navegación por teclado implementada

Contraste de colores adecuado

Semántica HTML correcta

Internacionalización (i18n)
Preparado para multi-idioma (pendiente implementación)

Formato de fechas localizado

Separación de textos en archivos de traducción

<div align="center">
⭐ ¿Te gusta este proyecto?
¡Dale una estrella en GitHub si te resulta útil!

</div>
Desarrollado con ❤️ para comunidades más conectadas
