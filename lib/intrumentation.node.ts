// instrumentation.ts
import { registerOTel } from '@vercel/otel';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from '@opentelemetry/core';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

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
