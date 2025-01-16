'use client';

import { useParams } from 'next/navigation';

export default function ParamsDisplay() {
  const params = useParams();

  return (
    <div className="rounded-lg p-4 shadow">
      <h1 className="mb-4 text-2xl font-bold">URL Parameters</h1>
      <pre className="rounded text-sm text-cyan-200">
        {JSON.stringify(params, null, 2)}
      </pre>
    </div>
  );
}
