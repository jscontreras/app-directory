import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path') || null;
  let log = '';
  const tag = request.nextUrl.searchParams.get('tag') || null;
  if (path) {
    log += `Path revalidated: ${path}\n`;
  }
  if (tag) {
    revalidateTag(collection);
    log += `Tag revalidated: ${tag}\n`;
  }
  // log the revalidated paths and tags
  console.log(log);

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    cache: 'no-store',
    log,
  });
}
