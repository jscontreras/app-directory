import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    // Process a POST request
    const invalidatePaths = [
      '/pages/revalidate/static-1',
      '/pages/revalidate/3',
      '/pages/revalidate',
    ];

    const promises = invalidatePaths.map((path) => {
      return res.revalidate(path);
    });

    await Promise.all(promises);
    return res.json({ revalidated: true });
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
