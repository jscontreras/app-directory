import { ExternalLink } from '#/ui/external-link';
import { UrlEncodingForm } from '#/ui/url-encoding-form';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Comparing Link vs Router push</h1>

      <ul>
        <li>
          By default, there is no encoding other than the browser (like spaces).
        </li>
        <li>
          Scroll works for both <code>Link</code> and <code>Router.push</code>
        </li>
        <li>
          Manual encoding could be added (when required) via{' '}
          <code>encodeURIComponent</code>
        </li>
        <li>
          Try navigating using Link or Router to see how the values are
          populated in the URL.
        </li>
      </ul>
      <UrlEncodingForm />
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
