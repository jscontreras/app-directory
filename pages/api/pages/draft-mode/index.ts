import { NextApiRequest, NextApiResponse } from "next"
//https://nextjs.org/docs/15/pages/guides/draft-mode

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== 'MY_SECRET_TOKEN') {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Toggle Draft Mode using getDraftMode
  // Determine if draftMode is enabled by checking the corresponding cookie existence
  // Next.js sets a cookie named "__prerender_bypass" in draft mode
  const isEnabled = !!req.cookies['__prerender_bypass'];
  res.setDraftMode({ enable: !isEnabled });

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(`/pages/draft-mode`)
}