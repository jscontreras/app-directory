import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { register } from './instrumentation';

register();
export function middleware(request: NextRequest) {
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
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/proxy-via-middleware',
};
