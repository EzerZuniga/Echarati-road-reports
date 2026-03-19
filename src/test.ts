import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare global {
  interface ImportMeta {
    glob<T = unknown>(
      pattern: string,
      options: {
        eager: true;
      }
    ): Record<string, T>;
    webpackContext?(
      request: string,
      recursive: boolean,
      pattern: RegExp
    ): {
      keys(): string[];
      <T>(id: string): T;
    };
  }
}

// Initialize the Angular testing environment once before any spec runs.
beforeAll(() => {
  getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
});

afterAll(() => {
  getTestBed().resetTestingModule();
});

// Discover and eagerly import every spec file for Karma.
const importMeta = import.meta as Partial<ImportMeta>;

if (typeof importMeta.glob === 'function') {
  importMeta.glob('./**/*.spec.ts', { eager: true });
} else if (typeof importMeta.webpackContext === 'function') {
  const context = importMeta.webpackContext('./', true, /\.spec\.ts$/);
  context.keys().forEach(context);
}

export {};
