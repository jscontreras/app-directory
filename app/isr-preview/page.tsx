import { ExternalLink } from '#/ui/external-link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Preview Draft (Demo)</h1>
      <ul>
        <li>By default, data fetching in Next.js is cached static.</li>
        <li>This example statically caches data fetches for Testing Post.</li>
        <li>Draft Mode can be enabled from the post page.</li>
        <li>Try navigating Testing Post and test draft mode.</li>
        <li>
          You can also invalidate the tag to see how fetch-cache and CDN-cache
          work together.
        </li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/configuring/draft-mode">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/tree/main/app/isr-preview">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';
