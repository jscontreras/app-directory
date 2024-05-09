import { ExternalLink } from '#/ui/external-link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Static Page with Dynamic Content</h1>

      <ul>
        <li>The Timezones page initially loads statically (cached).</li>
        <li>Dynamic data is loaded via a Server Component.</li>
        <li>
          The client component reads the query params in the URL and sends them
          to the React Server Component.
        </li>
        <li>The Server Component has a fetch cached callback.</li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#static-data-fetching">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/vercel/app-playground/tree/main/app/ssg">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';
