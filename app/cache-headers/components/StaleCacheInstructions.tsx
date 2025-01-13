import Link from 'next/link';
import { Highlight } from '#/ui/highlight';

export function StaleCacheInstructions() {
  return (
    <ul>
      <li>This example tests cache STALE for time-revalidated ISR pages.</li>
      <li>
        The{' '}
        <Link prefetch={true} href={'/cache-headers/timestamp'}>
          {'/cache-headers/timestamp'}
        </Link>{' '}
        is an ISR page with a <Highlight>15s</Highlight> revalidation period.
      </li>
      <li>
        {' '}
        It takes <Highlight>5 seconds</Highlight> to create a new snapshot of
        the page.
      </li>
      <li>
        During those 5 seconds, the <Highlight>STALE</Highlight> (previously
        cached) content is returned.
      </li>
      <li>
        Click on the{' '}
        <Highlight colorClass="text-purple-600">Start Fetching</Highlight>{' '}
        button, to send 20 consecutive requests inspecting the corresponding
        cache headers and timestamp content values.
      </li>
    </ul>
  );
}
