export interface Environment {
  readonly production: boolean;
  readonly apiUrl: string;
}

export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
} as const;
