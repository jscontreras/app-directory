import { type ApiData, verifyAccess } from '@vercel/flags';
import { getProviderData } from '@vercel/flags/next';
import { NextResponse, type NextRequest } from 'next/server';
import * as flags from '../../../../flags';

export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
  // Get the flags_site cookie
  const flagsSite = request.cookies.get('flags_site')?.value;
  // If the cookie exists and has a value, rewrite to that URL
  if (flagsSite) {
    try {
      const authHeader = request.headers.get('authorization');
      // Create a new headers object
      const headers = new Headers();

      // If the authorization header exists, add it to the new headers object
      if (authHeader) {
        headers.set('Authorization', authHeader);
      }
      const url = new URL(`${flagsSite}/.well-known/vercel/flags`);
      const response = await fetch(url, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Invalid URL in flags_site cookie:', error.message);
      const access = await verifyAccess(request.headers.get('Authorization'));
      // If the URL is invalid, continue to the original '/example' path
      if (!access) return NextResponse.json(null, { status: 401 });
      return NextResponse.json<ApiData>(getProviderData(flags));
    }
  }

  const access = await verifyAccess(request.headers.get('Authorization'));
  if (!access) return NextResponse.json(null, { status: 401 });

  return NextResponse.json<ApiData>(getProviderData(flags));
}
