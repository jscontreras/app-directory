import { Suspense } from 'react';
import { getActiveWidgets } from '#/lib/widgets';
import WidgetSkeleton from '#/components/WidgetSkeleton';
import WidgetWrapper from '#/components/WidgetWrapper';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const activeWidgets = await getActiveWidgets();

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <h1 className="mb-6 text-3xl font-bold">Dynamic Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeWidgets.map((widget) => (
          <Suspense key={widget} fallback={<WidgetSkeleton />}>
            <WidgetWrapper widgetName={widget} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
