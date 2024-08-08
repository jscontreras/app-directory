import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPHttpJsonTraceExporter, registerOTel } from '@vercel/otel';

export async function register() {
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === '1') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./lib/intrumentation.node');
    } else {
      registerOTel({
        serviceName: process.env.NEW_RELIC_APP_NAME,
        instrumentationConfig: {
          fetch: {
            propagateContextUrls: ['*'],
          },
        },
        attributes: {
          'highlight.project_id': process.env.PROJECT_ID,
          'highlight.source': 'backend',
        },
        traceExporter: new OTLPHttpJsonTraceExporter({
          url: 'https://otel.highlight.io:4318/v1/traces',
        }),
        spanProcessors: [
          new BatchSpanProcessor(
            new OTLPHttpJsonTraceExporter({
              url: 'https://otel.highlight.io:4318/v1/traces',
            }),
          ),
        ],
      });
    }
  } else {
    registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
  }
}
