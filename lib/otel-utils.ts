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
 * Enables tracing for an API function using OpenTelemetry.
 *
 * @param name - The name of the span.
 * @param fn - The function to be traced, which returns a `NextResponse`.
 * @param options - Optional configuration for the trace.
 * @param options.sendLogs - Whether to send logs or not. Default is `false`.
 * @param options.extraAttributes - Additional attributes to add to the span. Default is an empty object.
 * @returns A promise that resolves to the result of the traced function, with context injected.
 *
 * @throws Will throw an error if the traced function throws an error.
 */
export async function apiTraceEnabler(
  name: string,
  fn: () => NextResponse,
  options: { sendLogs: boolean; extraAttributes: Record<string, any> } = {
    sendLogs: false,
    extraAttributes: {},
  },
) {
  const spanFn = async (span: Span) => {
    try {
      // Invoke function
      const result = await fn();
      span.end();
      return contextInjector(result, options.sendLogs);
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

  const spanOptions: SpanOptions = {
    attributes: {
      api: 'hello from Vercel API!!',
      ...options.extraAttributes,
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
    activeSpan.setAttributes(spanOptions.attributes || {});
    const result = await fn();
    if (options.sendLogs) {
      console.log('OTEL>>> Reusing API Active Span: ', spanName);
    }
    return contextInjector(result, options.sendLogs);
  } else {
    // Sending Trace (Will create a new span within the middleware)
    const tracer = traceApi.getTracer(process.env.NEW_RELIC_APP_NAME || '');
    if (options.sendLogs) {
      console.log('OTEL>>> Sending API Span: ', spanName);
    }
    return tracer.startActiveSpan(spanName, spanOptions, async (span) => {
      return contextInjector(await spanFn(span), options.sendLogs);
    });
  }
}

/**
 * Enables tracing for Middleware using OpenTelemetry.
 *
 * @param name - The name of the span.
 * @param fn - The function to be traced, which returns a `NextResponse`.
 * @param options - Optional configuration for the trace.
 * @param options.sendLogs - Whether to send logs or not. Default is `false`.
 * @param options.extraAttributes - Additional attributes to add to the span. Default is an empty object.
 * @returns A promise that resolves to the result of the traced function, with context injected.
 *
 * @throws Will throw an error if the traced function throws an error.
 */
export async function middlewareTraceEnabler<T>(
  name: string,
  fn: () => Promise<Response>,
  options: { sendLogs: boolean; extraAttributes: Record<string, any> } = {
    sendLogs: false,
    extraAttributes: {},
  },
): Promise<Response> {
  const spanFn = async (span: Span) => {
    try {
      // Invoke function
      const result = await fn();
      span.end();
      return contextInjector(result, options.sendLogs);
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

  const spanOptions: SpanOptions = {
    attributes: {
      middleware: 'hello from Vercel Middleware!!',
      ...options.extraAttributes,
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
    activeSpan.setAttributes(spanOptions.attributes || {});
    const result = await fn();
    if (options.sendLogs) {
      console.log('OTEL>>> Reusing Active Span: ', spanName);
    }
    return contextInjector(result, options.sendLogs);
  } else {
    // Sending Trace (Will create a new span within the middleware)
    const tracer = traceApi.getTracer(process.env.NEW_RELIC_APP_NAME || '');
    if (options.sendLogs) {
      console.log('OTEL>>> Sending Span: ', spanName);
    }
    return tracer.startActiveSpan(spanName, spanOptions, async (span) => {
      return contextInjector(await spanFn(span), options.sendLogs);
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
