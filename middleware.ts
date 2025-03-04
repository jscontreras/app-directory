import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { precompute } from '@vercel/flags/next';
import { featureFlags } from './flags';
// Open Telemetry
import {
  context,
  propagation,
  Span,
  SpanOptions,
  SpanStatusCode,
  trace as traceApi,
} from '@opentelemetry/api';

// service name
const serviceName = process.env.NEW_RELIC_APP_NAME || '';

async function originalMiddleware(request: NextRequest) {
  const url = request.nextUrl;
  // ENABLING DRAFT BY URL PARAM
  if (url.pathname === '/isr-preview/1') {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('_draft');
    const DRAFT_SECRET = process.env.DRAFT_SECRET;
    const bypassCookie = request.cookies.get('__prerender_bypass');
    // Check if the secret query parameter is present and matches your secret token
    // If the bypass cookie is already set, we're in draft mode
    if (bypassCookie) {
      // Append the secret to the original request if it's present
      const url = request.nextUrl.clone();
      // Hide secret from being exposed
      if (secret !== 'true') {
        url.searchParams.delete('_draft');
        url.searchParams.set('_draft', 'true');
        return NextResponse.redirect(url);
      } else {
        return NextResponse.next();
      }
    }
    // Only proceed if the secret is present and correct
    if (secret === DRAFT_SECRET) {
      // Fetch to the API route that enables Draft Mode
      const draftResponse = await fetch(
        new URL(`/api/enable-draft?secret=${secret}`, request.url),
      );

      // Extract the Draft Mode bypass cookie
      const draftCookie = draftResponse.headers.get('set-cookie') || '';
      url.searchParams.delete('_draft');
      url.searchParams.set('_draft', 'true');
      const redirectUrl = new URL(url);
      const response = NextResponse.redirect(redirectUrl);
      response.headers.set('set-cookie', draftCookie);
      return response;
    } else {
      // If secret is invalid and cookie is not set then clean _draft
      if (secret && secret == 'true') {
        url.searchParams.delete('_draft');
        const redirectUrl = new URL(url);
        return NextResponse.redirect(redirectUrl);
      }
      // If url is clean then proceed
      else {
        return NextResponse.next();
      }
    }
  } else if (url.pathname === '/proxy-speed-insights.js') {
    const response = await fetch(
      'https://cdn.vercel-insights.com/v1/speed-insights/script.js',
    );
    // Check if the fetch was successful
    if (!response.ok) {
      return NextResponse.redirect('/error-page'); // Redirect to an error page if the fetch fails
    }
    // Get the content of the JavaScript file
    const jsContent = await response.text();

    // Return the JavaScript content as a response
    return new NextResponse(jsContent, {
      headers: { 'Content-Type': 'application/javascript' },
    });
  } else if (url.pathname === '/proxy-speed-insights.debug.js') {
    const response = await fetch(
      'https://cdn.vercel-insights.com/v1/speed-insights/script.debug.js',
    );
    // Check if the fetch was successful
    if (!response.ok) {
      return NextResponse.redirect('/error-page'); // Redirect to an error page if the fetch fails
    }
    // Get the content of the JavaScript file
    const jsContent = await response.text();

    // Return the JavaScript content as a response
    return new NextResponse(jsContent, {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }
  // How to override cache headers (This will break cache as it is private)
  else if (url.pathname.startsWith('/isr/')) {
    const response = NextResponse.next();
    if (url.pathname === '/isr/11') {
      // Remove the 'private' directive and set appropriate caching headers for ISR
      response.headers.set(
        'Cache-Control',
        'private, max-age=0, stale-while-revalidate',
      );
    }
    return response;
  } else if (url.pathname === '/proxy-via-middleware') {
    // Clone the request headers
    // You can modify them with headers API: https://developer.mozilla.org/en-US/docs/Web/API/Headers
    const requestHeaders = new Headers(request.headers);
    // You can also set request headers in NextResponse.rewrite

    // Create a new response with the rewritten URL
    const response = NextResponse.rewrite('https://echo.free.beeceptor.com');
    requestHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } else if (url.pathname === '/api/print-headers-middleware') {
    const logger = logs.getLogger(serviceName);
    // Emmitting Log with Open Telemetry Custom Provisioning (not working)
    logger.emit({
      body: `[${process.env.TELEMETRY_CUSTOM_PRODUCER}]** (OpenTelemetry) Testing Log Emiter for Middleware`,
      severityNumber: SeverityNumber.INFO,
      attributes: {
        key: 'value',
      },
    });
    const response = await fetch('https://echo.free.beeceptor.com');
    const data = await response.json();
    return new Response(
      JSON.stringify({
        hello: `world ${new Date().getMilliseconds()}`,
        ...data,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    );
  }
  // FEATURE FLAGS ENABLEMENT
  else if (
    url.pathname.startsWith('/h') ||
    url.pathname === '/' ||
    url.pathname === '/pocs/toolbar'
  ) {
    // Injecting additional headers for flags to operate
    await request.headers.set('x-pathname', url.pathname);
    // Permutations for ISR feature flags
    const code = await precompute(featureFlags);
    // Removing the extra header
    await request.headers.delete('x-pathname');

    // console.log(
    //   '`/flagged/${code}${request.nextUrl.pathname}${request.nextUrl.search}`',
    //   `/flagged/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
    // );

    const nextUrl = new URL(
      `/flagged/${code}${request.nextUrl.pathname}${request.nextUrl.search}`,
      request.url,
    );
    const response = NextResponse.rewrite(nextUrl, { request });
    return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/proxy-via-middleware',
    '/api/print-headers-middleware',
    '/proxy-speed-insights.js',
    '/proxy-speed-insights.debug.js',
    // Featured flags paths
    '/',
    '/h',
    '/h/:path*',
    '/isr/:path*',
    '/isr-preview/1',
    '/pocs/toolbar',
  ],
};

/**
 * Middleware implementation with span implementation
 * https://github.com/vercel/otel/blob/main/apps/sample/middleware.ts
 * @param request
 * @param event
 * @returns
 */
export async function middleware(request: NextRequest): Promise<Response> {
  return trace(`middleware-span`, async () => {
    return contextInjector(await originalMiddleware(request)) as any;
  });
}

function trace<T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> {
  const spanFn = async (span: any) => {
    try {
      const result = await fn(span);
      span.end();
      return result;
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
  const span = traceApi.getActiveSpan() || null;
  if (!span) {
    const tracer = traceApi.getTracer(serviceName);
    const options: SpanOptions = {
      attributes: {
        middleware: 'hello from Vercel Middleware!!',
      },
    };
    return tracer.startActiveSpan(name, options, spanFn);
  } else {
    span.setAttribute('middleware', 'hello from Vercel Middleware!!');
    return spanFn(span);
  }
}

/**
 * Add existing contextual headers if any
 * @param response
 * @returns
 */
function contextInjector(response: undefined | Response) {
  let responseObj = response ? response : NextResponse.next();
  const { headers } = responseObj || {};
  propagation.inject(context.active(), headers);
  Object.keys(headers).forEach((key: string) => {
    responseObj.headers.append(key, headers.get(key) + '');
  });
  return responseObj;
}
