import { NextResponse } from 'next/server';

export const dynamic = 'force-static'; // CDN

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
  return NextResponse.json({
    status: 'ok',
    timeNYC: currentTime,
    note: `This won't get path revalidated :(`,
  });
}
