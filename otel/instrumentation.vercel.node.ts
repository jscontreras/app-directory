import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { registerOTel } from '@vercel/otel';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { otelBaseConfig } from './instrumentation.vercel.edge';

const logExporter = new OTLPLogExporter({
  url: 'https://otlp.nr-data.net:4318/v1/logs', // New Relic OTLP endpoint
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY,
  },
});

const logsProcessor = new SimpleLogRecordProcessor(logExporter);

// Adding logs processor as it is supported for Nodejs runtime
registerOTel({ ...otelBaseConfig, logRecordProcessor: logsProcessor });
