import { getTraceContextHeaders } from '#/lib/otel-utils';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const duration = 60;
  const res = await fetch(`https://api.tc-vercel.dev/api/time`, {
    headers: {
      'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
      ...getTraceContextHeaders(true),
    },
    cache: 'no-store',
  });
  const data = (await res.json()) as { datetime: string };

  const currentTime = new Date(data.datetime).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return NextResponse.json(
    {
      status: 'ok',
      timeNYC: currentTime,
      note: `This cache is time revalidated (${duration} secs)`,
      cache: 'Using CDN headers',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': `max-age=${duration}`,
        'CDN-Cache-Control': `max-age=${duration}`,
        'Vercel-CDN-Cache-Control': `max-age=${duration}`,
      },
    },
  );
}
