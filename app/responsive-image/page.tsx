import { ExternalLink } from '#/ui/external-link';
import Image from 'next/image';
import dingo from '#/public/dingos/dingo.jpg';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Responsive Images (with same asset)</h1>
      <h1>Image Component With Layout Responsive</h1>
      <Image
        alt="Dingo"
        src={dingo}
        width={700}
        height={475}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          width: '100%',
          height: 'auto',
        }}
        priority={true}
      />
      <ul>
        <li>The image is automatically resized by NextJS.</li>
        <li>
          When using <span className="text-amber-400">priority=true</span> a
          preload link is added to the{' <head />'} tag using the corresponding
          srcSet.
        </li>
        <li>This srcSet is created based on the NextJS sizes.</li>
        <li>To use multiple sources, this needs to be handled differently.</li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#static-data-fetching">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/app/responsive-image/page.tsx">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
