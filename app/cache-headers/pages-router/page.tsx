import { ExternalLink } from '#/ui/external-link';
import CacheDemo from '../components/CacheDemo';
import { StaleCacheInstructions } from '../components/StaleCacheInstructions';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Vercel STALE Cache Demo (Pages Router)
      </h1>
      <StaleCacheInstructions pageUrl="/pages/timestamp" />
      <CacheDemo pageUrl="/pages/timestamp" />

      <div className="mt-6 flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/vercel/app-playground/tree/main/app/isr">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}

export const dynamic = 'force-static';
