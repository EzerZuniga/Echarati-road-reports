import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandler } from './handlers/global-error.handler';
import { AuthInterceptor } from './interceptors/auth.interceptor';

/**
 * CoreModule: importar UNA SOLA VEZ en AppModule.
 * Registra los providers globales de la aplicación:
 * - GlobalErrorHandler: captura errores no controlados
 * - AuthInterceptor: añade el token JWT a cada petición HTTP
 */
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {}
