import { CitiesShallowSelector } from '#/ui/cities-shallow-selector';
import SkeletonAlarmClock from '#/ui/skeleton-alarm-clock';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export async function generateStaticParams() {
  // Generate two pages at build time and the rest (3-100) on-demand
  return [{ id: '1' }, { id: '2' }];
}

export default async function Page({ params }: { params: { id: string } }) {
  if (Number(params.id) >= 100) {
    notFound();
  }
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    { next: { revalidate: false } },
  );
  const data = (await res.json()) as { title: string; body: string };
  console.log(`Rendering from server ssg2 (compute)[id:${params.id}].`);
  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {`${data.title} [${params.id}]`}
        </h1>
        <p className="line-clamp-3 font-medium text-gray-500">{data.body}</p>
        {/* client component */}
        {/* https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering */}
        <Suspense fallback={<SkeletonAlarmClock />}>
          <CitiesShallowSelector componentType="Client (API Route)" />
        </Suspense>
      </div>
    </div>
  );
}
