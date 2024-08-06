import { OTLPHttpJsonTraceExporter, registerOTel } from '@vercel/otel';
// import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export async function register() {
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === '1') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./lib/intrumentation.node');
    } else {
      registerOTel({
        serviceName: 'my-vercel-app',
        instrumentationConfig: {
          fetch: {
            propagateContextUrls: ['*'],
          },
        },
        attributes: {
          'highlight.project_id': 'YOUR_PROJECT_ID',
          'highlight.source': 'backend',
        },
        traceExporter: new OTLPHttpJsonTraceExporter({
          url: 'https://otel.highlight.io:4318/v1/traces',
        }),
        // spanProcessors: [
        //   new SimpleSpanProcessor(
        //     new OTLPTraceExporter({
        //       url: 'https://your-otel-endpoint/v1/traces',
        //       headers: {
        //         Authorization: `Bearer ${process.env.API_TOKEN}`,
        //         'X-Axiom-Dataset': process.env.DATASET_NAME,
        //       },
        //     })
        //   ),
        // ],
      });
    }
  } else {
    registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
  }
}
