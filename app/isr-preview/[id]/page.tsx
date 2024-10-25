import PreviewModeToggle from '#/ui/preview-toggle';
import { notFound } from 'next/navigation';
import { ExternalLink } from '#/ui/external-link';
import { RevalidateTagButton } from '#/ui/revalidate-tag-button';

export async function generateStaticParams() {
  // Generate two pages at build time and the rest (3-100) on-demand
  return [{ id: '1' }];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (Number(params.id) >= 100) {
    notFound();
  }
  const res = await fetch(`https://worldtimeapi.org/api/ip`, {
    cache: 'force-cache',
    next: { tags: ['test-preview'] },
  });

  let data;
  try {
    data = (await res.json()) as { datetime: string };
  } catch (e) {
    data = { datetime: new Date().toDateString() };
  }
  const dateObj = new Date(data.datetime);

  const currentTime = dateObj.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const postId = dateObj.getSeconds();
  // second request
  const resLorem = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      cache: 'force-cache',
      next: { tags: ['test-preview'] },
    },
  );

  const dataLorem = (await resLorem.json()) as { title: string; body: string };

  const date = currentTime;
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <PreviewModeToggle />
      <RevalidateTagButton
        copy="Invalidate Cache via Tag"
        tag={'test-preview'}
      />
      <h1 className="pt-8 text-xl font-bold">Preview Mode Test</h1>
      <ul>
        <li>
          Time in New York: <span className="text-amber-400">{date}</span>{' '}
          (obtained via cache-tagged fetch)
        </li>
      </ul>
      <div className="mb-8 grid grid-cols-4 gap-x-6 gap-y-3">
        <div className="col-span-full space-y-3 lg:col-span-4">
          <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
            [{postId}] {dataLorem.title}
          </h1>
          <h3 className="text-gray-200">
            Last snapshot (Vercel Serverless Fn Time):{' '}
            {new Date().toLocaleString('en-US', {
              timeZone: 'America/New_York',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })}
          </h3>
          <p className="line-clamp-3 font-medium text-gray-500">
            {dataLorem.body}
          </p>
          {/* client component */}
        </div>
      </div>
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
