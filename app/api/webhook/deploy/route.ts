import { NextResponse } from 'next/server';
import crypto from 'crypto';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const WEBHOOK_SECRET: string = process.env.WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    // Get the signature from headers
    const rawBody = await request.text();
    const rawBodyBuffer = Buffer.from(rawBody, 'utf-8');
    const bodySignature = sha1(rawBodyBuffer, WEBHOOK_SECRET);
    const requestSignature = request.headers.get('x-vercel-signature');
    // Verify the signature (Bypassing for testing)
    if (
      !WEBHOOK_SECRET ||
      (bodySignature !== requestSignature && WEBHOOK_SECRET != requestSignature)
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the body as JSON after verification
    const body = JSON.parse(rawBody);
    // Extract relevant information from the Vercel webhook payload
    const { payload, type } = body;

    console.log('Deployment:succeess HOOK DATA', payload);
    // Verify that this is a successful deployment
    if (type !== 'deployment.succeeded') {
      return NextResponse.json(
        { message: 'Not a successful deployment' },
        { status: 200 },
      );
    }
    // Only trigger for production
    if (payload?.target !== 'production') {
      return NextResponse.json(
        { message: 'Not a successful deployment' },
        { status: 200 },
      );
    }

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: `{"ref":"main","inputs":{"message":"${payload.name}","url":"${payload.url}"}}`,
    };

    const response = await fetch(
      'https://api.github.com/repos/jscontreras/app-directory/actions/workflows/143785299/dispatches',
      options,
    );
    try {
      const jsonResponse = await response.json();
      console.log(jsonResponse);

      // Check if the status starts with "2"
      if (!jsonResponse.status.startsWith('2')) {
        return NextResponse.json(jsonResponse, { status: jsonResponse.status });
      }
    } catch {
      // console.log(response);
    }

    return NextResponse.json(
      { message: 'Deployment notified to New Relic' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

function sha1(data: Buffer, secret: string): string {
  return crypto.createHmac('sha1', secret).update(data).digest('hex');
}
