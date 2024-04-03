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
  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {'Static Page with Dynamic Content'}
        </h1>
        {/* <p className="line-clamp-3 font-medium text-gray-500"> */}
        <ul className="mb-4 line-clamp-3 font-medium text-gray-500">
          <li>
            The page loads statically except for the time component which loads
            on Suspense.
          </li>
          <li>Dynamic data is loaded via a Server Component.</li>
          <li>
            The client component reads the query params in the URL and sends
            them to the React Server Component.
          </li>
          <li>The Server Component has a fetch cached callback.</li>
        </ul>
        {/* </p> */}
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
