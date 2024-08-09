import { registerOTel } from '@vercel/otel';

export async function register() {
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === '1') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./lib/instrumentation.node');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./lib/instrumentation.edge');
    }
  } else {
    registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
  }
}
