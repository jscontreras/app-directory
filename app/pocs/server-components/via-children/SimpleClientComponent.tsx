'use client';

export function SimpleClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2 className="text-fuchsia-400">{'<Client Component />'}</h2>
      <p>This client component loads a Server component as a child.</p>
      <p>
        The ServerComponent is rendered server-side but the attributes must
        exist at server time.
      </p>
      {children}
    </div>
  );
}
