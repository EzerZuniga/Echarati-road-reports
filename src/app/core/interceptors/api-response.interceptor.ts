import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

interface ApiWrapper<T = unknown> {
  success: boolean;
  statusCode: number;
  data?: T;
  message?: string;
  timestamp: string;
}

/**
 * Desenvuelve la respuesta estándar del TransformInterceptor de NestJS.
 *
 * Entrada:  { success: true, statusCode: 200, data: { ... }, timestamp: "..." }
 * Salida:   { ... }   ← solo el contenido de "data"
 *
 * Para errores HTTP, extrae el mensaje del backend si existe.
 */
@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((event) => {
        if (
          event instanceof HttpResponse &&
          req.url.startsWith(environment.apiUrl) &&
          this.isWrapped(event.body)
        ) {
          return event.clone({ body: (event.body as ApiWrapper).data });
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => {
        if (req.url.startsWith(environment.apiUrl) && err.error && typeof err.error === 'object') {
          const body = err.error as ApiWrapper;
          if (body.message) {
            return throwError(
              () =>
                new HttpErrorResponse({
                  error: { ...err.error, message: body.message },
                  headers: err.headers,
                  status: err.status,
                  statusText: err.statusText,
                  url: err.url ?? undefined,
                })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }

  private isWrapped(body: unknown): body is ApiWrapper {
    return !!body && typeof body === 'object' && 'success' in body && 'data' in body;
  }
}
