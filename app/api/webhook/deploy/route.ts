import { NextResponse } from 'next/server';
import crypto from 'crypto';

const GITHUB_TOKEN = process.env.GITHUB_SECRET;
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
    const payload = JSON.parse(rawBody);

    // Verify that this is a successful deployment
    if (payload.type !== 'deployment.succeeded') {
      return NextResponse.json(
        { message: 'Not a successful deployment' },
        { status: 200 },
      );
    }
    // Only trigger for production
    if (payload.target !== 'production') {
      return NextResponse.json(
        { message: 'Not a successful deployment' },
        { status: 200 },
      );
    }

    // Extract relevant information from the Vercel webhook payload
    const { url } = payload;
    console.log('Deployment:succeess HOOK DATA', payload);

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: `{"ref":"main","inputs":{"message":"Vercel Prod Deployment","url":"${url}"}}`,
      cache: 'no-cache',
    };

    fetch(
      'https://api.github.com/repos/jscontreras/app-directory/actions/workflows/143785299/dispatches',
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

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
