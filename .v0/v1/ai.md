# Creating a Rewrite Rule with Cache Headers

I'll create a route handler for `/cached-rewrite` that fetches data from the API and adds cache headers to the response.

<CodeProject id="cached-rewrite">
```tsx file="app/cached-rewrite/route.ts"
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Make sure this is always dynamically evaluated

export async function GET(request: NextRequest) {
try {
// Fetch data from the API
const res = await fetch(
`https://api.tc-vercel.dev/api/time`,
{
headers: {
'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
},
},
);

    // Get the response data
    const data = await res.json();

    // Create a new response with the data
    const response = NextResponse.json(data);

    // Add cache headers to the response
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
    response.headers.set('CDN-Cache-Control', 'public, max-age=300');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, max-age=300');

    return response;

} catch (error) {
console.error('Error fetching data:', error);
return NextResponse.json(
{ error: 'Failed to fetch data' },
{ status: 500 }
);
}
}

````

```tsx file="middleware.ts"
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for the cached-rewrite path
  if (pathname === '/cached-rewrite') {
    // No need to rewrite as we have a route handler for this path
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cached-rewrite'],
};
````

</CodeProject>

## Explanation

1. **Route Handler (`app/cached-rewrite/route.ts`)**:

   - Creates a GET route handler for `/cached-rewrite`
   - Fetches data from the API with the custom API key
   - Returns the data with cache headers added to the response
   - Sets `dynamic = 'force-dynamic'` to ensure the route is always evaluated

2. **Cache Headers**:

   - `Cache-Control: public, max-age=300, s-maxage=300` - Allows caching for 5 minutes (300 seconds) in both browsers and CDN
   - `CDN-Cache-Control: public, max-age=300` - Specific directive for CDN caching
   - `Vercel-CDN-Cache-Control: public, max-age=300` - Vercel-specific CDN cache control

3. **Middleware (`middleware.ts`)**:
   - Configures the middleware to handle requests to `/cached-rewrite`
   - In this case, it simply passes the request through since we have a route handler

This implementation will:

1. Handle requests to `/cached-rewrite`
2. Fetch data from the API
3. Add cache headers to the response
4. Return the data to the client

The cache headers will instruct browsers and CDNs to cache the response for 5 minutes, reducing the number of requests to the origin server.
