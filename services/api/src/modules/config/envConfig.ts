export interface EnvConfig {
  NODE_ENV: 'development' | 'production';
  BASE_HREF: string;
  APP_HOST: string;
  APP_PORT: number;
  APP_URL: string;
  DB_DRIVER: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  WORKER_CRON_TAB: string;
}
