import { ExternalLink } from '#/ui/external-link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Server Components injection</h1>
      <ul>
        <li>
          Shows different composition patterns to include Server Components.
        </li>
        <li>Click on the tabs to explore the patterns in detail.</li>
        <li>Source links included below.</li>
      </ul>
    </div>
  );
}

export const dynamic = 'force-static';
