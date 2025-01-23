import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const fileName =
    request.nextUrl.searchParams.get('file') || 'Pizigani_1367_Chart_10MB.jpg';
  try {
    const fileUrl = new URL(`/assets/${fileName}`, request.url);
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
