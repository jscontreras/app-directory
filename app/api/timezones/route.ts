import { NextResponse } from 'next/server';

export async function GET() {
  const resTime = await fetch(`https://worldtimeapi.org/api/ip`, {
    next: { revalidate: 300, tags: ['timezone'] },
  });
  const data = (await resTime.json()) as { datetime: string };
  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic'; // defaults to auto
