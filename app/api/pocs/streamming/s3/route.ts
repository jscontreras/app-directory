import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const clientConfig = {
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

export async function GET(request: NextRequest) {
  const s3Client = new S3Client(clientConfig);
  const fileName =
    request.nextUrl.searchParams.get('file') || 'Pizigani_1367_Chart_10MB.jpg';

  if (!fileName) {
    return NextResponse.json(
      { error: 'File name is required' },
      { status: 400 },
    );
  }

  const bucketName = process.env.BUCKET_NAME;

  if (!bucketName) {
    console.error('Missing required environment variable: BUCKET_NAME');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 },
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const fileUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Set the content type to force download
    const contentType = 'application/octet-stream';

    // Create a new response with the streamed body and set appropriate headers
    return new Response(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 },
    );
  }
}
