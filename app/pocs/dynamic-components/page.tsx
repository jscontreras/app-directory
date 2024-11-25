import { Suspense } from 'react';
import { getActiveWidgets } from '#/lib/widgets';
import WidgetWrapper from '#/components/WidgetWrapper';
import WidgetSkeleton from '#/components/WidgetSkeleton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const activeWidgets = await getActiveWidgets();

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="mb-10 text-3xl font-bold">Dynamic Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeWidgets.map((widget) => (
          <Suspense key={widget} fallback={<WidgetSkeleton />}>
            <WidgetWrapper widgetName={widget} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
