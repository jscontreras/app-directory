import { getISODateServerAction } from '#/lib/actions';
import { RenderingInfo } from '#/ui/rendering-info';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

// Next.js will invalidate the cache when a
// request comes in, at most once every 100 seconds.
export const revalidate = 100;

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const int_id = Number.parseInt(id, 10);

  // Check if id is bigger than 100
  if (int_id > 100) {
    notFound();
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${int_id}`,
    {
      next: { tags: ['collection'] },
      cache: 'force-cache',
    },
  );

  const timeRes = await fetch(`https://api.tc-vercel.dev/api/time`, {
    headers: {
      'X-Custom-TC-Api-Key': process.env.CUSTOM_API_KEY || '',
    },
    cache: 'no-cache',
    next: { tags: ['isr-tag-date'] },
  });
  const { datetime } = (await timeRes.json()) as { datetime: string };
  const dateObj = new Date(datetime);
  const currentTime = dateObj.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const data = (await res.json()) as { title: string; body: string };

  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">{`[${int_id}] ${data.title}`}</h1>
        <p className="font-medium text-gray-500">{data.body}</p>
        <p className="font-medium text-amber-200">
          Snapshot Date: {currentTime}
        </p>
      </div>
      <div className="-order-1 col-span-full lg:order-none lg:col-span-2">
        <RenderingInfo type="isr" />
      </div>
    </div>
  );
}
