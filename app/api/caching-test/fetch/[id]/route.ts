import { NextRequest, NextResponse } from 'next/server';

/**
 * This route is used to test the caching of the API.
 * It is a static route that is cached on the CDN and uses dynamic params.
 * The fetch cache is set to 10 mins.
 * What happens when the Page is CDN revalidated? Is the fetch (data-cache revalidated as well?
 * No, the fetch cache is not revalidated. STALE data is served until the new data is fetched but it will look
 * the same as the previous data is cached at the fetch level.
 * What happens when the fetch cache is revalidated? Is the Page revalidated as well?
 * Yes,the CDN is revalidated automatically. STALE data is served until the new data is stored in the fetch cache.
 * What happens when the fetch cache expires? Is the Page (CDN path) revalidated as well?
 * Yes, the CDN path is revalidated automatically. STALE data is served until the new data is stored in the fetch cache.
 */
export const dynamic = 'force-static'; // static by default so CDN is enforced on TOP
const dataCacheMins = 10;
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
      revalidate: 60 * dataCacheMins, // 10 mins
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
    caches: [
      'cdn-until-revalidate',
      `fetch-data-cache-for-${dataCacheMins}-mins`,
    ],
    dataCache: 'fetch',
    tags,
    id,
  });
}
