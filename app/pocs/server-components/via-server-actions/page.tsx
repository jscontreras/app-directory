import { SimpleClientComponent } from './SimpleClientComponent';

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
        A client component is loaded and it uses a server action to get the
        data.
      </p>
      <SimpleClientComponent />
    </div>
  );
}
