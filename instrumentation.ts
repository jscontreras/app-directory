import { registerOTel } from '@vercel/otel';

export async function register() {
  // vercel means using @vercel/otel natively without NewRelic extension.
  // This way will trace middlware but no context for some reason
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === 'vercel') {
    // For Node it supports open telemetry logs
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./otel/instrumentation.vercel.node');
    }
    // Edge supports traces. (logs is WIP)
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./otel/instrumentation.vercel.edge');
    }
  }
  // sdk means using opentelemetry SDK (no vercel/otel)
  else if (process.env.TELEMETRY_CUSTOM_PRODUCER === 'sdk') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./otel/instrumentation.sdk.node');
    }
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./otel/instrumentation.sdk.edge');
    }
  }
  // By default it uses the credentials from newRelic-Vercel extension
  // This way will not work for middleware tracing
  else {
    registerOTel({
      serviceName: process.env.NEW_RELIC_APP_NAME,
    });
  }
}
