import AlarmClock from '#/ui/alarm-clock';
import { CitiesSelector } from '#/ui/cities-selector';
import RendererWrapper from '#/ui/renderer-wrapper';
import SkeletonAlarmClock from '#/ui/skeleton-alarm-clock';

export async function generateStaticParams() {
  // Generate two pages at build time and the rest (3-100) on-demand
  return [{ id: '1' }, { id: '2' }];
}

/**
 * This page is dynamic due to the use of searchParams
 * @param param0
 * @returns
 */
export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    { cache: 'force-cache' },
  );
  const data = (await res.json()) as { title: string; body: string };
  console.log(`Rendering from server ppr (compute)[id:${params.id}].`);
  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {data.title}
        </h1>
        <p className="line-clamp-3 font-medium text-gray-500">{data.body}</p>
        {/* client component that injects query params*/}
        <CitiesSelector componentType="Server" />
        {/* Special component that injects client params into server components */}
        <RendererWrapper
          rendererFn={async (clientParams: any) => {
            'use server';
            // Server component to be rendered after mount.
            // @ts-expect-error Server Component
            return <AlarmClock searchParams={clientParams} />;
          }}
        >
          {/* Component to render on mount */}
          <SkeletonAlarmClock message="--" />
        </RendererWrapper>
      </div>
    </div>
  );
}
