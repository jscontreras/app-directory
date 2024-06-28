import { SuspensedClientComponent } from './SuspensedClientComponent';

/**
 * BAsic Server component
 * @param label
 * @returns
 */
function SimpleServerComponent({ label }: { label: string }) {
  const versionWithV = process.version;
  return (
    <div className="m-2 border-2 border-dashed p-2 ">
      <h2 className="text-sky-400">{'<Server Component />'}</h2>
      <p>Label: {label}</p>
      <p>Node Version: {versionWithV}</p>
    </div>
  );
}

/**
 *  Render a server component via ServerAction
 */
export default async function FuncEmbed() {
  return (
    <div>
      <h1 className="mb-4 w-full text-xl font-bold">
        Server Component Injection
      </h1>
      <p>
        A client component is loaded and it contains an independent server
        component within.
      </p>
      <SuspensedClientComponent
        renderFn={async (label: string) => {
          'use server';
          // You can use any server actions/variables here
          // Server component to be rendered after mount.
          return <SimpleServerComponent label={label} />;
        }}
      />
    </div>
  );
}
