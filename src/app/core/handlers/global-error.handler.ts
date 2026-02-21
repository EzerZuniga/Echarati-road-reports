import { ErrorHandler, Injectable, isDevMode, NgZone } from '@angular/core';

/**
 * Global error handler that intercepts uncaught errors across the application.
 * In production, this would forward errors to a remote logging service (e.g. Sentry).
 * In dev mode, it also displays an overlay to help the developer spot issues quickly.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: unknown): void {
    this.zone.run(() => {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;

      console.error('[Echarati Reports — Error no controlado]', {
        message,
        stack,
        timestamp: new Date().toISOString(),
      });

      // Only show an on-screen overlay in dev mode to avoid leaking
      // internal details (and potential XSS vectors) in production.
      if (isDevMode() && typeof document !== 'undefined') {
        const overlay = document.createElement('div');
        overlay.style.cssText =
          'position:fixed;top:0;left:0;width:100%;background:#b91c1c;color:#fff;' +
          'padding:20px;z-index:999999;font-family:monospace;white-space:pre-wrap;';

        const heading = document.createElement('h1');
        heading.textContent = 'Error detectado';
        overlay.appendChild(heading);

        const msg = document.createElement('p');
        msg.textContent = message;
        overlay.appendChild(msg);

        if (stack) {
          const pre = document.createElement('pre');
          pre.textContent = stack;
          overlay.appendChild(pre);
        }

        document.body.appendChild(overlay);
      }
    });
  }
}
