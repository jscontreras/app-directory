import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerOTel, OTLPHttpProtoTraceExporter } from '@vercel/otel';

const traceExporter = new OTLPHttpProtoTraceExporter({
  url: 'https://otel.highlight.io:4318/v1/traces',
});

const spanProcesor = new SimpleSpanProcessor(traceExporter);

export const otelBaseConfig = {
  serviceName: process.env.NEW_RELIC_APP_NAME,
  instrumentationConfig: {
    fetch: {
      ignoreUrls: [/^https:\/\/telemetry.nextjs.org/],
      propagateContextUrls: [/^.*/],
      // dontPropagateContextUrls: [/no-propagation\=1/],
      // attributesFromRequestHeaders: {
      //   'request.cmd': 'X-Cmd',
      // },
      // attributesFromResponseHeaders: {
      //   'response.server': 'X-Server',
      // },
    },
  },
  attributesFromHeaders: {
    client: 'X-Client',
  },
  attributes: {
    'highlight.project_id': process.env.PROJECT_ID,
    'highlight.source': 'backend',
  },
  traceExporter: traceExporter,
  spanProcessors: [spanProcesor],
};

// Log Exported it is still not supported on edge
// Pending fix https://github.com/sfishel18/vercel-otel/commit/d134528067900299d212072dfa1a9ed31e1ac653
registerOTel(otelBaseConfig);
