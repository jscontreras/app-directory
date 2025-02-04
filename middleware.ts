import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { register } from './instrumentation';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { precompute } from '@vercel/flags/next';
import { featureFlags } from './flags';

// service name
const serviceName = process.env.NEW_RELIC_APP_NAME || '';

// Register Service
register();

export async function middleware(
  request: NextRequest,
  context: NextFetchEvent,
) {
  const url = request.nextUrl;
  if (url.pathname.startsWith('/isr/')) {
    // Use fetch to get the response
    const response = await fetch(request.url, {
      headers: request.headers,
      method: request.method,
      body: request.body,
      cache: 'no-store',
    });

    // Read the response body as text
    const bodyText = await response.text();
    // Check if the body contains the not-found page content
    if (bodyText.includes('not-found.tsx')) {
      // If it does, create a new response with status 404
      return new NextResponse(bodyText, {
        status: 404,
        headers: response.headers,
      });
    }

    // If it's not a 404, return the original response
    return new NextResponse(bodyText, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }
  if (url.pathname === '/proxy-speed-insights.js') {
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
  else if (url.pathname === '/isr/11') {
    const response = NextResponse.next();
    // Remove the 'private' directive and set appropriate caching headers for ISR
    response.headers.set(
      'Cache-Control',
      'private, max-age=0, stale-while-revalidate',
    );
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
    '/isr/11',
    '/isr/12',
    '/pocs/toolbar',
    // Overriding 404s
    '/isr/:path*',
  ],
};
