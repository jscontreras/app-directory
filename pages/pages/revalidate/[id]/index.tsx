import { ExternalLink } from '#/ui/external-link';
import RevalidatePageLayout from '#/ui/pages-layout';

export default function ISRExample({
  postId,
  dataLorem,
  date,
  lastSnapshot,
}: {
  postId: string;
  dataLorem: any;
  date: string;
  lastSnapshot: string;
}) {
  return (
    <RevalidatePageLayout id={postId}>
      return (
      <div className="prose prose-sm prose-invert max-w-none">
        <h1 className="text-xl font-bold">Revalidating Path</h1>

        <ul>
          <li>This page takes 10 seconds to be rendered (when not cached)</li>
          <li>
            Time in New York: <span className="text-amber-400">{date}</span>{' '}
            (obtained via fetch)
          </li>
          <li>Lorem ipsum post (obtained via fetch)</li>
          <li>
            Pages path-based revalidations clears the corresponding cached
            values and stores new ones (fresh values).
          </li>
          <li>
            The pages router will return the latest cache value (stale cache)
            until the new one is ready.
          </li>
          <li>
            If an error occurs while generating the new page, the old cached
            value will be returned instead.
          </li>
        </ul>
        <div className="mb-8 grid grid-cols-6 gap-x-6 gap-y-3">
          <div className="col-span-full space-y-3 lg:col-span-4">
            <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
              [{postId}] {dataLorem?.title || 'Loading Title...'}
            </h1>
            <h3 className="text-gray-200">Last snapshot: {lastSnapshot}</h3>
            <p className="line-clamp-3 font-medium text-gray-500">
              {dataLorem?.body || 'Loading Body...'}
            </p>
            {/* client component */}
          </div>
        </div>

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

export async function getStaticProps({ params }: { params: any }) {
  const postId = params?.id.replace('static-', '') || '1';
  await delay(9000);
  const res = await fetch(`https://worldtimeapi.org/api/ip`);
  const data = (await res.json()) as { datetime: string };
  const dateObj = new Date(data.datetime);
  const currentTime = dateObj.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  // second request
  const resLorem = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );

  const dataLorem = (await resLorem.json()) as { title: string; body: string };

  const date = currentTime;

  // If the request was successful, return the posts
  // and revalidate every 10 seconds.
  return {
    props: {
      postId,
      dataLorem,
      date,
      lastSnapshot: new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
    },
    revalidate: 3600 * 24,
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: 'static-1' } }],
    fallback: true,
  };
}
