import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

const cached_res = unstable_cache(
  async () => {
    return { ok: true, now: Date.now() };
  },
  ['api-caching-test-key'],
  {
    tags: ['api-caching-test'],
  },
);

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(await cached_res());
}
