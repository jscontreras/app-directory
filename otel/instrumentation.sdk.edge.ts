import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPHttpJsonTraceExporter, registerOTel } from '@vercel/otel';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
// import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

// // Configure the OTLP log exporter
// const otlpLogExporter = new OTLPLogExporter({
//   url: 'https://otlp.nr-data.net:4318/v1/logs', // New Relic OTLP endpoint
//   headers: {
//     'api-key': process.env.NEW_RELIC_LICENSE_KEY,
//   },
// });

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
  //  logRecordProcessor: new SimpleLogRecordProcessor(otlpLogExporter),
});
