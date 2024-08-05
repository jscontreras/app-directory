import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
}
