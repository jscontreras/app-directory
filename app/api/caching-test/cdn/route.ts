import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
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
  return NextResponse.json(
    {
      status: 'ok',
      timeNYC: currentTime,
      note: `This cache is time revalidated (30 secs)`,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=30',
        'CDN-Cache-Control': 'max-age=60',
        'Vercel-CDN-Cache-Control': 'max-age=3600',
      },
    },
  );
}
