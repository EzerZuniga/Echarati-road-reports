import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getAccessToken();
    const cloned = token ? this.addToken(req, token) : req;

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !req.url.includes('/auth/')) {
          return this.handle401(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private handle401(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((t): t is string => t !== null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token)))
      );
    }
    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);
    return this.auth.refreshToken().pipe(
      switchMap(tokens => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(tokens.accessToken);
        return next.handle(this.addToken(req, tokens.accessToken));
      }),
      catchError(err => {
        this.isRefreshing = false;
        this.auth.logout();
        return throwError(() => err);
      })
    );
  }
}
