// instrumentation.ts
import { FetchInstrumentationConfig, registerOTel } from '@vercel/otel';
import {
  OTLPHttpJsonTraceExporter,
  OTLPHttpProtoTraceExporter,
} from '@vercel/otel';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Configure the OTLP log exporter
const otlpLogExporter = new OTLPLogExporter({
  url: 'https://otlp.nr-data.net:4318/v1/logs', // New Relic OTLP endpoint
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY || '',
  },
  keepAlive: true,
  concurrencyLimit: 10,
  timeoutMillis: 5000,
});

const METRICS_COLLECTOR_STRING = 'https://otlp.nr-data.net:4318/v1/metrics';

const newRelicMetricsExporter: any = new OTLPHttpJsonTraceExporter({
  url: METRICS_COLLECTOR_STRING,
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY || '',
  },
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: newRelicMetricsExporter,
  exportIntervalMillis: 10000,
});

// Define the New Relic OTLP endpoint
const COLLECTOR_STRING = 'https://otlp.nr-data.net:4318/v1/traces';

// Create an OTLP trace exporter for New Relic
const newRelicJsonTraceExporter = new OTLPHttpProtoTraceExporter({
  url: COLLECTOR_STRING,
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY || '', // Ensure your New Relic Ingest License key is set in the environment variables
  },
});

const newRelicHtmlTraceExporter = new OTLPHttpJsonTraceExporter({
  url: COLLECTOR_STRING,
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY || '', // Ensure your New Relic Ingest License key is set in the environment variables
  },
});

// Register the OpenTelemetry SDK
registerOTel({
  serviceName: process.env.NEW_RELIC_APP_NAME,
  metricReader: metricReader,
  spanProcessors: [
    new SimpleSpanProcessor(newRelicJsonTraceExporter),
    new SimpleSpanProcessor(newRelicHtmlTraceExporter),
  ],
  logRecordProcessor: new SimpleLogRecordProcessor(otlpLogExporter),
  instrumentationConfig: {
    fetch: {
      ignoreUrls: [/^https:\/\/telemetry.nextjs.org/],
      propagateContextUrls: [/^https:\/\/api.tc\-vercel.dev\/api\/.*/],
    } as FetchInstrumentationConfig,
  },
});
