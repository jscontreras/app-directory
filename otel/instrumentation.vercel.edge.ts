import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { registerOTel, OTLPHttpProtoTraceExporter } from '@vercel/otel';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

// import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

// // Configure the OTLP log exporter
// const otlpLogExporter = new OTLPLogExporter({
//   url: 'https://otlp.nr-data.net:4318/v1/logs', // New Relic OTLP endpoint
//   headers: {
//     'api-key': process.env.NEW_RELIC_LICENSE_KEY,
//   },
// });

const logExporter = new OTLPLogExporter({
  url: 'https://otlp.nr-data.net:4318/v1/logs', // New Relic OTLP endpoint
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY,
  },
});

const logsProcessor = new SimpleLogRecordProcessor(logExporter);

const traceExporter = new OTLPHttpProtoTraceExporter({
  url: 'https://otel.highlight.io:4318/v1/traces',
});

const spanProcesor = new SimpleSpanProcessor(traceExporter);

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
  traceExporter: traceExporter,
  spanProcessors: [spanProcesor],
  // Pending fix https://github.com/sfishel18/vercel-otel/commit/d134528067900299d212072dfa1a9ed31e1ac653
  //logRecordProcessor: logsProcessor
});
