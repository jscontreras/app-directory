import { ExternalLink } from '#/ui/external-link';
import { Highlight } from '#/ui/highlight';
import Link from 'next/link';
import { RevalidateTagButton } from './revalidate-tag-button';

export function UnstableCacheInstructions({
  children,
  dynamicTag,
}: {
  children?: React.ReactNode;
  dynamicTag?: string;
}): React.ReactElement {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Caching Behavior (unstable_cache Nextv14)
      </h1>
      <div className="mb-8 grid grid-cols-3 gap-x-6 gap-y-3">
        <div className="col-span-full space-y-3 lg:col-span-4">
          Using <Highlight>unstable_cache</Highlight> allows you to control
          caching storage by throwing errors based on custom logic. Overriding{' '}
          <Highlight colorClass={'text-purple-400'}>revalidate: 20</Highlight>
          {dynamicTag && (
            <>
              {' '}
              and adding tag{' '}
              <Highlight colorClass={'text-purple-400'}>
                [{dynamicTag}]
              </Highlight>{' '}
              to the existing cached data
            </>
          )}
          .
        </div>
        <div className="col-span-full space-y-3 lg:col-span-4">
          <div className="flex flex-wrap items-center gap-2">
            <RevalidateTagButton
              copy={`Revalidate Tag: ${dynamicTag}`}
              tag={`${dynamicTag}`}
            />
            <RevalidateTagButton
              copy={`Revalidate Tag: default-tag`}
              tag={`default-tag`}
            />
          </div>
        </div>
      </div>
      <ul>
        <li>
          Try{' '}
          <Link prefetch={false} href={`/pocs/unstable_cache/error`}>
            <Highlight>{`/pocs/unstable_cache/error`}</Highlight>
          </Link>{' '}
          to avoid caching.
        </li>
        <li>
          Try{' '}
          <Link prefetch={false} href={`/pocs/unstable_cache/test`}>
            <Highlight>{`/pocs/unstable_cache/test`}</Highlight>
          </Link>{' '}
          to see caching.
        </li>
      </ul>
      <div className="mb-8 grid grid-cols-6 gap-x-6 gap-y-3">
        <div className="col-span-full space-y-3 lg:col-span-4">{children}</div>
      </div>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/14/app/api-reference/functions/unstable_cache">
          Docs (Next 14)
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/app/pocs/unstable_cache/%5Bid%5D/page.tsx">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
