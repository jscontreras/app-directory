import { draftMode } from 'next/headers';

const DRAFT_SECRET = process.env.DRAFT_SECRET;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  if (secret !== DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return new Response('Draft mode is enabled');
}
