import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getTraceContextHeaders } from '#/lib/otel-utils';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const cached_res = unstable_cache(
  async () => {
    const res = await fetch(`https://api.tc-vercel.dev/api/time`, {
      headers: {
        'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
        ...getTraceContextHeaders(true),
      },
      cache: 'no-store',
    });

    let data;
    try {
      data = (await res.json()) as { datetime: string };
    } catch (e) {
      data = { datetime: new Date().toDateString() };
    }

    const currentTime = new Date(data.datetime).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    return {
      ok: true,
      timeNYC: currentTime,
      runtime: 'edge',
      dataCache: 'unstable_cache',
      tags: 'api-caching-test-key',
    };
  },
  ['api-caching-test-key'],
  {
    tags: ['api-caching-test'],
  },
);

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await cached_res());
}
