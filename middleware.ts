import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { register } from './instrumentation';

// service name
const serviceName = process.env.NEW_RELIC_APP_NAME || '';

// Register Service
register();

export async function middleware(
  request: NextRequest,
  context: NextFetchEvent,
) {
  const url = request.nextUrl;
  if (url.pathname === '/proxy-via-middleware') {
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
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/proxy-via-middleware', '/api/print-headers-middleware'],
};
