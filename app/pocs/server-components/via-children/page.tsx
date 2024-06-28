import { SimpleClientComponent } from './SimpleClientComponent';

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
      <p>Label: Server:: {label}</p>
      <p>Node Version: {versionWithV}</p>
    </div>
  );
}

/**
 *  Render a server component via ServerAction
 */
export default async function SimpleEmbed() {
  return (
    <div>
      <h1 className="mb-4 w-full text-xl font-bold">
        Server Component Injection
      </h1>
      <p>
        A client component is loaded and it contains an independent server
        component within.
      </p>
      <SimpleClientComponent>
        <SimpleServerComponent label="Label from Server Side Rendering" />
      </SimpleClientComponent>
    </div>
  );
}
