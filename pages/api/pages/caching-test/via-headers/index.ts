import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const duration = 60;
  const res = await fetch(`https://worldtimeapi.org/api/ip`, {
    cache: 'no-store',
  });
  const data = (await res.json()) as { datetime: string };

  const currentTime = new Date(data.datetime).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  response.setHeader('Cache-Control', `public, s-maxage=${duration}`);

  return response.status(200).json({
    status: 'ok',
    timeNYC: currentTime,
    note: `This cache is time revalidated (${duration} secs)`,
  });
}
