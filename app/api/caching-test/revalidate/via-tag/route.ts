import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const tags = ['api-caching-test'];
  //revalidateTag('api-caching-test');
  const promises = tags.map((tag) => {
    return revalidateTag(tag);
  });
  await Promise.all(promises);
  return NextResponse.json({ ok: true, method: 'revalidateTag', tags });
}
