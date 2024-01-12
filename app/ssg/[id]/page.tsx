import AlarmClock from '#/ui/alarm-clock';
import { CitiesShallowSelector } from '#/ui/cities-shallow-selector';

import { RenderingInfo } from '#/ui/rendering-info';
import SkeletonAlarmClock from '#/ui/skeleton-alarm-clock';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
  // Generate two pages at build time and the rest (3-100) on-demand
  return [{ id: '1' }, { id: '2' }];
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (Number(params.id) >= 100) {
    notFound();
  }

  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();
  console.log('##SERVER###', `Current time: ${hours}:${minutes}:${seconds}`);

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    { next: { revalidate: false } },
  );
  const data = (await res.json()) as { title: string; body: string };

  const isOnDemand = Number(params.id) >= 3;
  const { city, timezone } = searchParams;
  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {data.title}
        </h1>
        <p className="line-clamp-3 font-medium text-gray-500">{data.body}</p>
        {/* client component */}
        <CitiesShallowSelector>
          {/* server component */}
          <Suspense fallback={<SkeletonAlarmClock />}>
            {/* @ts-expect-error Async Server Component */}
            <AlarmClock city={city} timezone={timezone} />
          </Suspense>
        </CitiesShallowSelector>
      </div>
      <div className="-order-1 col-span-full lg:order-none lg:col-span-2">
        <RenderingInfo type={isOnDemand ? 'ssgod' : 'ssg'} />
      </div>
    </div>
  );
}
