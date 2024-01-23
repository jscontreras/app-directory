'use client';

import { ReactNode, Suspense, useEffect, useState } from 'react';
import SkeletonAlarmClock from './skeleton-alarm-clock';

/**
 * Container that suspense to connect client context to
 * Server. Protect re-renders
 * @param param0
 * @returns
 */
export default function RendererWrapper({
  rendererFn,
  children,
}: {
  rendererFn: Function;
  children: ReactNode | ReactNode[];
}) {
  // Client will be used here
  const [params, setParams] = useState({
    city: '',
    timezone: '',
    // Render for the first rendering!
    render: children,
  });

  // THis will only occur in the client
  useEffect(() => {
    setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.has('city') && searchParams.has('timezone')) {
        if (
          searchParams.get('city') == params.city &&
          searchParams.get('timezone') == params.timezone
        ) {
          // console.log('repaint(skipped)', params);
          return;
        } else {
          //  console.log('repaint(real)', params, searchParams.get('city'), searchParams.get('timezone'));
          // Get data from Server
          const tTimezone = searchParams.get('timezone') || '';
          const tCity = searchParams.get('city') || '';
          // without await to get suspense promise
          const render = rendererFn({
            city: tCity,
            timezone: tTimezone,
            ready: true,
          });
          // Updating param
          setParams({
            city: tCity,
            timezone: tTimezone,
            render: render,
          });
        }
      }
    }, 100);
  }, [params, rendererFn]);

  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2>{`<Hybrid Component/>`}</h2>
      <Suspense fallback={<SkeletonAlarmClock />}>{params.render}</Suspense>
    </div>
  );
}
