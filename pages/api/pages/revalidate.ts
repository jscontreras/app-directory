import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // Process a POST request
    await res.revalidate('/pages/revalidate');
    return res.json({ revalidated: true });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
