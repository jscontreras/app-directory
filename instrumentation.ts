import { registerOTel } from '@vercel/otel';

export async function register() {
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === '1') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./lib/intrumentation.node');
    } else {
      registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
    }
  }
}
