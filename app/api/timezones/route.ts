import { NextResponse } from 'next/server';

export async function GET() {
  const resTime = await fetch(`https://api.tc-vercel.dev/api/time`, {
    headers: {
      'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
    },
    next: { revalidate: 300, tags: ['timezone'] },
  });
  let data;
  try {
    data = (await resTime.json()) as { datetime: string };
  } catch (e) {
    data = { datetime: new Date().toDateString() };
  }
  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic'; // defaults to auto
