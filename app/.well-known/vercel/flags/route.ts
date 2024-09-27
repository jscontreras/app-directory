import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccess, type ApiData } from '@vercel/flags';

export async function GET(request: NextRequest) {
  const access = await verifyAccess(request.headers.get('Authorization'));
  if (!access) return NextResponse.json(null, { status: 401 });

  return NextResponse.json<ApiData>({
    definitions: {
      bottomBar: {
        description: 'Controls whether the BottomBar is visible',
        origin: 'https://example.com/#new-feature',
        options: [
          { value: false, label: 'Hide' },
          { value: true, label: 'Show' },
        ],
      },
    },
  });
}
