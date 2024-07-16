import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.TC_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidateTag('api-caching-test');
  return NextResponse.json({ ok: true });
}
