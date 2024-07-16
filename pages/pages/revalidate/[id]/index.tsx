import { ExternalLink } from '#/ui/external-link';
import { Highlight } from '#/ui/highlight';
import RevalidatePageLayout from '#/ui/pages-layout';

export default function ISRExample({
  postId,
  seconds,
  dataLorem,
  date,
  lastSnapshot,
}: {
  postId: string;
  seconds: string;
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
          <li>
            This page takes <Highlight>10 seconds</Highlight> to be rendered
            (when not cached)
          </li>
          <li>
            Time in New York: <Highlight>{date}</Highlight> (obtained via fetch)
          </li>
          <li>
            {`Lorem ipsum post is obtained via fetch using NYC time seconds as post id `}
            <Highlight>{`(seconds:${seconds})`}</Highlight>
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
        <div className="mb-8 grid grid-cols-6 gap-x-6 gap-y-3">
          <div className="col-span-full space-y-3 lg:col-span-4">
            <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
              [{seconds}] {dataLorem?.title || 'Loading Title...'}
            </h1>
            <h3 className="text-gray-200">Last snapshot: {lastSnapshot}</h3>
            <p className="line-clamp-3 font-medium text-gray-500">
              <Highlight>{dataLorem?.body || 'Loading Body...'}</Highlight>
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

  const seconds = dateObj.getSeconds();
  console.log('seconds', seconds);

  // second request
  const resLorem = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${seconds}`,
  );

  const dataLorem = (await resLorem.json()) as { title: string; body: string };

  const date = currentTime;

  // If the request was successful, return the posts
  // and revalidate every 24 seconds.
  return {
    props: {
      postId,
      seconds,
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
