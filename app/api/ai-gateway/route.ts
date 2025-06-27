import { generateText } from 'ai';

export async function POST(request: Request) {
  try {
    const { model, prompt } = await request.json();
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await generateText({
      model: model || 'xai/grok-3',
      prompt,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}