import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Convert headers to an object
  const headers: any = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  delete headers['x-vercel-protection-bypass'];
  delete headers['x-vercel-sc-headers'];
  delete headers['x-vercel-proxy-signature'];
  return NextResponse.json({
    now: Date.now(),
    origin: 'tc-vercel.dev',
    headers: headers,
  });
}
