// Open Telemetry
import {
  context,
  propagation,
  Span,
  SpanOptions,
  SpanStatusCode,
  trace as traceApi,
} from '@opentelemetry/api';

import { NextResponse } from 'next/server';

// Define an interface for the output object that will hold the trace information.
interface Carrier {
  traceparent?: string;
  tracestate?: string;
}

/**
 * This function gets the active tracer (and span if any) and creates a new span with context
 * @param name Name of the Span (Unless there is an active Span name already)
 * @param fn Middleware Implementaton
 * @param sendLogs Print console log messages when sending spans
 * @param Object Optional Custom Attributes added to the Span.
 * @returns
 */
export async function traceEnabler<T>(
  name: string,
  fn: () => Promise<Response>,
  sendLogs: boolean = false,
  extraAttributes?: Record<string, any>,
): Promise<Response> {
  const spanFn = async (span: Span) => {
    try {
      // Invoke function
      const result = await fn();
      span.end();
      return contextInjector(result, sendLogs);
    } catch (e) {
      if (e instanceof Error) {
        span.recordException(e);
        span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
        console.error(e);
      } else {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: JSON.stringify(e),
        });
      }
      span.end();
      throw e;
    }
  };

  const options: SpanOptions = {
    attributes: {
      middleware: 'hello from Vercel Middleware!!',
      ...extraAttributes,
    },
  };
  // Get activeSpan will capture the context (parent trace)
  const activeSpan = traceApi.getActiveSpan() || null;
  let spanName = name;
  if (activeSpan) {
    // Getting active span name so it groups in New Relic Dashboard
    spanName = activeSpan.spanContext.name.length
      ? `middleware(custom span): ${activeSpan.spanContext.name}`
      : name;
    // Adding custom attributes to the Span
    activeSpan.setAttributes(options.attributes || {});
    const result = await fn();
    if (sendLogs) {
      console.log('OTEL>>> Reusing Active Span: ', spanName);
    }
    return contextInjector(result, sendLogs);
  } else {
    // Sending Trace (Will create a new span within the middleware)
    const tracer = traceApi.getTracer(process.env.NEW_RELIC_APP_NAME || '');
    if (sendLogs) {
      console.log('OTEL>>> Sending Span: ', spanName);
    }
    return tracer.startActiveSpan(spanName, options, async (span) => {
      return contextInjector(await spanFn(span), sendLogs);
    });
  }
}

/**
 * Add existing contextual headers if any
 * @param response
 * @returns
 */
function contextInjector(response: undefined | Response, sendLogs: boolean) {
  let responseObj = response ? response : NextResponse.next();
  const headers: Record<string, string> = {
    ...getTraceContextHeaders(sendLogs, { name: responseObj.url }),
  };
  Object.keys(headers).forEach((key: string) => {
    if (headers[key]) {
      responseObj.headers.append(key, headers[key]);
    }
  });
  return responseObj;
}

/**
 * Creates a new span as a child of the Middleware main span (subspan)
 * @param spanName Name of the Span
 * @param options Span Options
 * @param fn
 * @returns
 */
export function addCustomSpan(
  spanName: string,
  options: SpanOptions,
  fn: () => Promise<Response>,
  sendLogs: boolean = false,
) {
  //Sending Trace (Will create a new span within the middleware)
  const spanFn = async (span: Span) => {
    try {
      // Invoke function
      const result = await fn();
      span.end();
      return contextInjector(result, sendLogs);
    } catch (e) {
      if (e instanceof Error) {
        span.recordException(e);
        span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
      } else {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: JSON.stringify(e),
        });
      }
      span.end();
      throw e;
    }
  };

  const tracer = traceApi.getTracer(process.env.NEW_RELIC_APP_NAME || '');
  if (sendLogs) {
    console.log('OTEL>>> Sending Span: ', spanName);
  }
  return tracer.startActiveSpan(spanName, options, spanFn);
}

/**
 * Generates and returns trace context headers for OpenTelemetry propagation.
 *
 * @param {boolean} [sendLogs=false] - Optional flag to log the generated headers to the console.
 * @returns {Headers} The generated trace context headers.
 */
export function getTraceContextHeaders(
  sendLogs: boolean = false,
  options?: { name: string },
): Carrier {
  // Propagate headers
  const headers: Carrier = {};
  propagation.inject(context.active(), headers);
  if (sendLogs) {
    console.log(
      'OTEL>>> Trace Headers: ',
      headers,
      options?.name ? `>${options?.name}` : '',
    );
  }
  return headers;
}
