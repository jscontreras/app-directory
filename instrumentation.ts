import { registerOTel } from '@vercel/otel';

export async function register() {
  console.log('<< OTEL EXECUTED ON >>>', process.env.NEXT_RUNTIME);
  // vercel means using @vercel/otel natively without NewRelic extension.
  // This way will trace middlware but no context for some reason
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === 'manual') {
    // Edge supports traces. (logs is WIP)
    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./otel/instrumentation.vercel.edge');
    }
    // For Node it supports open telemetry logs
    else {
      await import('./otel/instrumentation.vercel.node');
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
