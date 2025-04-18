import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const GITHUB_TOKEN = process.env.GITHUB_SECRET;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function verifySignature(
  body: string,
  signature: string | null,
  secret: string,
) {
  if (!signature) return false;
  const hmac = createHmac('sha1', secret);
  const computedSignature = hmac.update(body).digest('hex');
  return signature === `sha1=${computedSignature}`;
}

export async function POST(request: Request) {
  try {
    // Get the raw body as text for signature verification
    const rawBody = await request.text();

    // Get the signature from headers
    const signature = request.headers.get('x-vercel-signature');

    // Verify the signature
    if (
      !WEBHOOK_SECRET ||
      !verifySignature(rawBody, signature, WEBHOOK_SECRET)
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
    const { url, meta } = payload;
    const { githubCommitSha, githubCommitMessage } = meta;

    // Prepare the payload for New Relic
    const newRelicPayload = {
      deployment: {
        revision: githubCommitSha,
        changelog: githubCommitMessage,
        description: `Deployed to ${url}`,
        user: 'Vercel Deployment',
      },
    };

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: `{"ref":"main","inputs":{"name":"Vercel Prod Deployment","home":"${url}"}}`,
    };

    fetch(
      'https://api.github.com/repos/jscontreras/app-directory/actions/workflows/143785299/dispatches',
      options,
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
