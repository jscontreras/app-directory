'use client';

import { Suspense, useEffect, useState } from 'react';
import SkeletonAlarmClock from './skeleton-alarm-clock';

/**
 * Container that suspense to connect client context to
 * Server. Protect re-renders
 * @param param0
 * @returns
 */
export default function RendererWrapper({
  rendererFn,
}: {
  rendererFn: Function;
}) {
  // Client will be used here
  const [params, setParams] = useState({
    city: 'London',
    timezone: 'Europe/London',
    ready: false,
    compo: <></>,
  });

  // THis will only occur in the client
  useEffect(() => {
    console.log('Wrapper Mounted');
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('city') && searchParams.has('timezone')) {
        if (
          searchParams.get('city') == params.city &&
          searchParams.get('timezone') == params.timezone
        ) {
          return;
        }
        // Get data from Server
        const tTimezone = searchParams.get('timezone') || '';
        const tCity = searchParams.get('city') || '';
        const compo = rendererFn({
          city: tCity,
          timezone: tTimezone,
          ready: true,
        });
        setParams({
          city: tCity,
          timezone: tTimezone,
          ready: true,
          compo: compo,
        });
      }
    }, 200);
  }, [params, rendererFn]);

  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2>{`<Server Component/>`}</h2>
      <Suspense fallback={<SkeletonAlarmClock />}>
        {params.ready ? params.compo : <SkeletonAlarmClock />}
      </Suspense>
    </div>
  );
}
