import { ExternalLink } from '#/ui/external-link';
import { Highlight } from '#/ui/highlight';
import { BasicLayout } from '#/ui/pages-layout';

export default function HeadersPage({ headers }: { headers: Object }) {
  return (
    <BasicLayout>
      return (
      <div className="prose prose-sm prose-invert max-w-none">
        <h1 className="text-xl font-bold">Headers</h1>

        <ul>
          <li>Fetch Headers</li>
        </ul>
        <div className="mb-8 grid grid-cols-3 gap-x-6 gap-y-3">
          <div className="col-span-full space-y-3 lg:col-span-4">
            <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
              JSON Headers (Original)
            </h1>
            <pre>{JSON.stringify(headers, null, 2)}</pre>
          </div>
        </div>

        <div className="flex gap-2">
          <ExternalLink href="https://nextjs.org/docs/app/api-reference/functions/fetch">
            Docs
          </ExternalLink>
          <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/pages/pages/headers/original/index.tsx">
            Code
          </ExternalLink>
        </div>
      </div>
    </BasicLayout>
  );
}

export async function getServerSideProps() {
  // JSON request
  const echoHeaders = await fetch(`https://echo.free.beeceptor.com`);

  const response: any = await echoHeaders.json();
  return {
    props: {
      headers: response,
    },
  };
}
