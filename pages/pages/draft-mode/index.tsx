import { BasicLayout } from '#/ui/pages-layout';
import { PcCase } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getCache } from '@vercel/functions';
import { ExternalLink } from '#/ui/external-link';

export async function getStaticProps(context: GetServerSidePropsContext) {

  // If is not on preview mode then use the cached data
  const withDataCache = context.draftMode ? false : true;
  return {
    revalidate: 30,
    props: {
      remoteTime: await getTimeFromServer(withDataCache),
      localTime: new Date().toISOString(),
      draftMode: context.draftMode || false,
    },
  };
}

export default function Page({ remoteTime, localTime, draftMode }: { remoteTime: string, localTime: string, draftMode: boolean }) {
  return (
    <BasicLayout>
      <h1 className="text-2xl font-bold text-white">Pages RouterDraft Mode Test (ISR + Runtime Cache)</h1>
      <div className="my-8 text-gray-200 max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">About this page</h2>
        <p className="mb-3">
          This page demonstrates how to use <span className="font-mono text-yellow-400">Next.js Draft Mode</span> and <span className="font-mono text-yellow-400">ISR tag revalidation</span>.
          You can toggle Draft Mode to preview unpublished content and observe how page and data cache behavior changes.
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li className="mb-1">
            <span className="font-semibold">Toggle Draft Mode:</span> Click the &quot;Enable/Disable Draft Mode&quot; button above.
            It calls the <a
              href="/api/pages/draft-mode?secret=MY_SECRET_TOKEN"
              className="text-sky-400 underline"
              target="_blank"
              rel="noopener"
            >/api/pages/draft-mode?secret=MY_SECRET_TOKEN</a> endpoint (<code className="bg-gray-900 px-1 rounded">pages/api/pages/draft-mode/index.ts</code>).
            This toggles draft mode by setting a secure cookie, and redirects back here.
          </li>
          <li className="mb-1">
            <span className="font-semibold">Revalidate Data Cache:</span>
            To manually invalidate the ISR cache for a tag, use
            <a
              href="/api/pages/invalidate-runtime-tag?tag=blog-time"
              className="text-sky-400 underline"
              target="_blank"
              rel="noopener"
            >/api/pages/invalidate-runtime-tag?tag=blog-time</a>
            (<code className="bg-gray-900 px-1 rounded">pages/api/pages/invalidate-runtime-tag/index.ts</code>).

            This will cause the &quot;Remote Server Time&quot; to refetch from the server on the next request.
          </li>
        </ul>
      <div className="bg-yellow-900/80 border-l-4 border-yellow-500 rounded-md px-4 py-3 my-4">
        <span className="font-bold text-yellow-300">Note:</span>{" "}
        <span className="text-yellow-100">
          Even if ISR is revalidating CDN cache every 30 seconds, the Page building process will only fetch fresh data once the data-cache tag is invalidated (on-demand revalidation at the Runtime Cache level).
        </span>
      </div>
      </div>
      <div className="flex flex-row gap-4 items-stretch justify-center my-8">
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 text-gray-200 shadow-lg max-w-[400px] w-full h-full flex flex-col">
          <div className={`${draftMode ? "bg-red-600" : "bg-emerald-600"} text-white px-8 py-4 rounded-lg mb-4`}>
            <p>
              {draftMode ? "Draft Mode is enabled" : "Draft Mode is disabled"}
            </p>
            <button
              type="button"
              className="mt-3 bg-gray-900 text-white border border-white/25 rounded-lg px-5 py-2 cursor-pointer font-semibold text-base"
              onClick={() => {
                window.location.href = "/api/pages/draft-mode?secret=MY_SECRET_TOKEN";
              }}
            >
              {draftMode ? "Disable Draft Mode" : "Enable Draft Mode"}
            </button>
          </div>
          <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
            <PcCase size={20} /> Draft Mode Time Card
          </h2>
          <div className="flex flex-col gap-3 flex-grow">
            <div>
              <span className="font-semibold">Remote Server Time:</span>
              <div className="font-mono px-3 py-2 rounded-lg mt-1 break-all text-yellow-400 text-3xl">
                {remoteTime ?? <span className="text-gray-400">Loading...</span>}
              </div>
            </div>
            <div>
              <span className="font-semibold">Local (build/run) Time:</span>
              <div className="font-mono bg-gray-800 px-3 py-2 rounded-lg mt-1 break-all">
                {localTime}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 border border-white/20 rounded-xl p-5 shadow-md max-w-lg text-white w-full h-full flex flex-col">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2 text-white">
            ⏱️ ISR Revalidation Info
          </h3>
          <div className="flex flex-col gap-2 flex-grow">
            <div>
              <span className="font-semibold text-white">Revalidation Period:</span>
              <div className="font-mono bg-gray-900 px-3 py-1 rounded-md mt-1 w-fit text-white">
                30 seconds
              </div>
            </div>
            <div>
              <span className="font-semibold text-white">Data-cache Tag:</span>
              <div className="font-mono bg-gray-900 px-3 py-1 rounded-md mt-1 w-fit text-white">
                blog-time
              </div>
            </div>
            <button
              className="mt-2 bg-blue-700 text-white border-none rounded-md px-4 py-2 cursor-pointer font-semibold text-base w-fit"
              onClick={async () => {
                window.location.href = `/api/pages/invalidate-runtime-tag?tag=blog-time`;
              }}
            >
              Invalidate Tag
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/15/pages/guides/incremental-static-regeneration">
          ISR Docs
        </ExternalLink>
        <ExternalLink href="https://vercel.com/changelog/introducing-the-runtime-cache-api">
          Runtime Cache API
        </ExternalLink>
        <ExternalLink href="https://nextjs.org/docs/15/pages/guides/draft-mode">
          Draft Mode Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/vercel/app-playground/tree/main/app/isr">
          Code
        </ExternalLink>
      </div>
    </BasicLayout>
    );
}

async function getTimeFromServer(withDataCache: boolean) {

  const cache = getCache();
  const cacheKey = 'blog-time';
  const cachedData = await cache.get(cacheKey);
  if (withDataCache && cachedData) {
    return cachedData;
  }

  const timeRes = await fetch(`https://api.tc-vercel.dev/api/time`, {
    headers: {
      'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
    },
  });
  const { datetime } = (await timeRes.json()) as { datetime: string };
  const dateObj = new Date(datetime);
  const currentTime = dateObj.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  await cache.set(cacheKey, currentTime.toString(), {
    tags: [cacheKey],
  });


  return currentTime;
}
