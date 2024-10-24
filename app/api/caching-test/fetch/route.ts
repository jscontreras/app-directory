import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(): Promise<NextResponse> {
  const res = await fetch('https://worldtimeapi.org/api/ip', {
    cache: 'force-cache',
    next: { tags: ['api-caching-test'] },
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
  return NextResponse.json({
    status: 'ok',
    timeNYC: currentTime,
    runtime: 'nodejs',
    dataCache: 'fetch',
  });
}
