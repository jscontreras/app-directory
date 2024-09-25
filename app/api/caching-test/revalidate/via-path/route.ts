import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  const paths = [
    '/api/caching-test',
    '/api/caching-test/fetch',
    '/api/caching-test/via-headers',
  ];
  //revalidateTag('api-caching-test');
  const promises = paths.map((path) => {
    return revalidatePath(path);
  });
  await Promise.all(promises);
  return NextResponse.json({ ok: true, method: 'revalidatePath', paths });
}
