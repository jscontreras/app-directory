import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPHttpJsonTraceExporter, registerOTel } from '@vercel/otel';

export async function register() {
  if (process.env.TELEMETRY_CUSTOM_PRODUCER === '1') {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./lib/intrumentation.node');
    } else {
      const METRICS_COLLECTOR_STRING =
        'https://otlp.nr-data.net:4318/v1/metrics';
      const newRelicMetricsExporter: any = new OTLPTraceExporter({
        url: METRICS_COLLECTOR_STRING,
        headers: {
          'api-key': process.env.NEW_RELIC_LICENSE_KEY,
        },
      });
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
        logRecordProcessor: new BatchLogRecordProcessor(
          new OTLPLogExporter({
            url: 'https://log-api.newrelic.com/log/v1', // New Relic OTLP endpoint
            headers: {
              'api-key': process.env.NEW_RELIC_LICENSE_KEY,
            },
          }),
        ),
        metricReader: new PeriodicExportingMetricReader({
          exporter: newRelicMetricsExporter,
          exportIntervalMillis: 10000,
        }),
      });
    }
  } else {
    registerOTel({ serviceName: process.env.NEW_RELIC_APP_NAME });
  }
}
