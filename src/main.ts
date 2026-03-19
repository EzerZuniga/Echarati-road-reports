import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

declare const module:
  | {
      hot?: {
        accept: () => void;
        dispose: (cb: () => void) => void;
      };
    }
  | undefined;

function registerGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event: ErrorEvent) => {
    console.error('Global error captured:', event.error || event.message, event);
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}

async function bootstrap(): Promise<void> {
  registerGlobalErrorHandlers();

  const t0 = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

  try {
    await platformBrowserDynamic().bootstrapModule(AppModule);
    const t1 =
      typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
    console.info(`App bootstrapped in ${Math.round(t1 - t0)} ms`);
  } catch (err) {
    // Log only — no DOM overlay here because GlobalErrorHandler
    // already covers error display in dev mode post-bootstrap.
    console.error('Bootstrap failed:', err);
  }

  if (module?.hot) {
    module.hot.accept();
    module.hot.dispose(() => {});
  }
}

bootstrap();
