import { registerOTel } from '@vercel/otel';

export async function register() {
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === 'vercel') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./otel/instrumentation.vercel.node');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./otel/instrumentation.vercel.edge');
    }
  } else if (process.env.TELEMETRY_CUSTOM_PRODUCER === 'sdk') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./otel/instrumentation.sdk.node');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./otel/instrumentation.sdk.edge');
    }
  } else {
    registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
  }
}
