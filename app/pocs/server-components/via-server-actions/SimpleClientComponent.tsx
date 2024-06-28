'use client';

import { version } from 'os';
import { Suspense, useEffect, useState } from 'react';
import { getServerComponentData } from './lib';

/**
 * Client component loading state of server component
 * @returns
 */
function ServerComponentSkeleton({
  label = '???',
  nodeVersion = 'Loading Node Version...',
}) {
  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2 className="text-sky-400">
        {label == '???'
          ? '<Loading Server Data... />'
          : '<Client Component (with server data). />'}
      </h2>
      <p>Label: {label}</p>
      <p>{nodeVersion}</p>
    </div>
  );
}

/**
 * Client component with Loader
 * @param param0
 * @returns
 */
export function SimpleClientComponent() {
  const [serverComp, setServerComp] = useState({
    render: <ServerComponentSkeleton />,
    init: false,
  }) as any;
  useEffect(() => {
    if (!serverComp.init) {
      setServerComp(async () => {
        const resp = await getServerComponentData('Text from client');
        setServerComp({
          init: true,
          render: <ServerComponentSkeleton {...resp} />,
        });
      });
    }
  }, [serverComp]);

  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2 className="text-fuchsia-400">{'<Client Component />'}</h2>
      <p>This client component loads a Server component as a promise.</p>
      <p>
        Render variables can be obtained from the client using Server Actions.
      </p>
      <p>The initial server side rendering is the skeleton component.</p>
      <Suspense fallback={<ServerComponentSkeleton />}>
        {serverComp.render}
      </Suspense>
    </div>
  );
}
