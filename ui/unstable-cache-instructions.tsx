import { ExternalLink } from '#/ui/external-link';
import { Highlight } from '#/ui/highlight';
import Link from 'next/link';

export function UnstableCacheInstructions({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Caching Behavior (unstable_cache Nextv14)
      </h1>
      <div className="mb-8 grid grid-cols-6 gap-x-6 gap-y-3">
        <div className="col-span-full space-y-3 lg:col-span-4">
          Using <Highlight>unstable_cache</Highlight> allows you to control
          caching storage by throwing errors based on custom logic.
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
        <ExternalLink href="https://github.com/jscontreras/app-directory/tree/preview/app/pocs/unstable_cache/[id]/page.tsx">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
