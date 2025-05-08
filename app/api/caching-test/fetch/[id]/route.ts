import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is used to test the caching of the API.
 * It is a static route that is cached for 1 hour.
 * What happens when the Page is CDN revalidated? Is the fetch cache revalidated as well?
 *
 */
export const dynamic = 'force-static'; // static by default so CDN is enforced on TOP

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;
  const tags = ['api-caching-test', `api-caching-test-${id}`];
  const res = await fetch('https://api.tc-vercel.dev/api/time', {
    headers: {
      'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
    },
    cache: 'force-cache',
    next: {
      tags,
      revalidate: 1800, // 30 mins
    },
  });
  const data = (await res.json()) as { datetime: string };

  const currentTime = new Date(data.datetime).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return NextResponse.json({
    status: 'ok',
    timeNYC: currentTime,
    runtime: 'nodejs',
    caches: ['cdn-until-revalidate', 'fetch-data-cache-for-30-mins'],
    dataCache: 'fetch',
    tags,
    id,
  });
}
