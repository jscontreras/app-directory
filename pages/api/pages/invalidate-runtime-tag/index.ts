import { NextApiRequest, NextApiResponse } from "next"
import { invalidateByTag } from '@vercel/functions';

//https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package#invalidatebytag

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.tag) {
    return res.status(400).json({ message: 'Tag is required' })
  }
  // With stale for stampede protection
  await invalidateByTag(req.query.tag as string);
  res.redirect(`/pages/draft-mode`)
}