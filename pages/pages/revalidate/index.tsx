import { ExternalLink } from '#/ui/external-link';
import { Highlight } from '#/ui/highlight';
import RevalidatePageLayout from '#/ui/pages-layout';

export default function PagesRevalidateHome() {
  return (
    <RevalidatePageLayout id={null}>
      return (
      <div className="prose prose-sm prose-invert max-w-none">
        <h1 className="text-xl font-bold">
          Revalidating Paths with Pages Router
        </h1>

        <ul>
          <li>
            The routes for{' '}
            <Highlight href="/pages/revalidate/static-1">{`Static [1]`}</Highlight>
            {` `}
            and{' '}
            <Highlight href="/pages/revalidate/static-3">{`ISR [3]`}</Highlight>
            {` `}
            take <Highlight>10</Highlight> seconds to be rendered (when not
            cached)
          </li>
          <li>
            Page path-based revalidations clear the corresponding cached values
            and store new ones (fresh values).
          </li>
          <li>
            The <Highlight>pages router</Highlight> will return the latest cache
            value (stale cache) until the new one is ready.
          </li>
          <li>
            For testing cache staling, refresh the page (after triggering
            revalidate) during the 10 seconds it takes to generate a new
            version.
          </li>
          <li>
            If an error occurs while generating the new page, the old cached
            value will be returned instead.
          </li>
        </ul>
        <div className="mb-8 grid grid-cols-6 gap-x-6 gap-y-3"></div>

        <div className="flex gap-2">
          <ExternalLink href="https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration#using-on-demand-revalidation">
            Docs
          </ExternalLink>
          <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/pages/pages/revalidate.tsx">
            Code
          </ExternalLink>
        </div>
      </div>
    </RevalidatePageLayout>
  );
}

// Function to create a delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
