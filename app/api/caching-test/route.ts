import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const cached_res = unstable_cache(
  async () => {
    const res = await fetch(`https://worldtimeapi.org/api/ip`, {
      cache: 'no-store',
    });
    const data = (await res.json()) as { datetime: string };

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
