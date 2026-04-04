import { NgModule, ErrorHandler, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandler } from './handlers/global-error.handler';
import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // El orden importa: ApiResponse desenvuelve ANTES de que Auth maneje 401
    { provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule ya fue importado. Solo debe importarse en AppModule.');
    }
  }
}
