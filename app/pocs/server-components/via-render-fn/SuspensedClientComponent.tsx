'use client';

import { Suspense, useEffect, useState } from 'react';

/**
 * Client component loading state of server component
 * @returns
 */
function ServerComponentSkeleton() {
  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2 className="text-sky-400">{'<Server Component Loading... />'}</h2>
      <p>Label: ???</p>
      <p>Loading Node Version...</p>
    </div>
  );
}

/**
 * Client component with Loader
 * @param param0
 * @returns
 */
export function SuspensedClientComponent({ renderFn }: { renderFn: Function }) {
  const [serverComp, setServerComp] = useState(null);
  useEffect(() => {
    if (!serverComp) {
      setServerComp(renderFn('Text from client'));
    }
  }, [renderFn, serverComp]);

  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2 className="text-fuchsia-400">{'<Client Component />'}</h2>
      <p>This client component loads a Server component as a promise.</p>
      <p>Server Component Rendering is exposed as an async function.</p>
      <p>The initial server side rendering is the skeleton component.</p>
      <Suspense fallback={<ServerComponentSkeleton />}>{serverComp}</Suspense>
    </div>
  );
}
