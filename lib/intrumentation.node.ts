// instrumentation.ts
import { registerOTel } from '@vercel/otel';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';

const METRICS_COLLECTOR_STRING = 'https://otlp.nr-data.net:4318/v1/metrics';

const newRelicMetricsExporter: any = new OTLPMetricExporter({
  url: METRICS_COLLECTOR_STRING,
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY,
  },
});

const metricReader = new PeriodicExportingMetricReader({
  exporter: newRelicMetricsExporter,
  exportIntervalMillis: 10000,
});

// Set up diagnostic logging (optional)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Define the New Relic OTLP endpoint
const COLLECTOR_STRING = 'https://otlp.nr-data.net:4318/v1/traces';

// Create an OTLP trace exporter for New Relic
const newRelicExporter = new OTLPTraceExporter({
  url: COLLECTOR_STRING,
  headers: {
    'api-key': process.env.NEW_RELIC_LICENSE_KEY, // Ensure your New Relic Ingest License key is set in the environment variables
  },
});

// Initialize the OpenTelemetry SDK
const sdk = new NodeSDK({
  serviceName: process.env.NEW_RELIC_APP_NAME,
  traceExporter: newRelicExporter,
  metricReader: metricReader,
  instrumentations: [getNodeAutoInstrumentations()],
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator()],
  }),
});

// Register the OpenTelemetry SDK
registerOTel({
  ...sdk,
  serviceName: process.env.NEW_RELIC_APP_NAME,
});

sdk.start();