/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from '#/ui/external-link';
import Link from 'next/link';
import { preload } from 'react-dom';

function PreloadLink({
  defaultImage,
  opt,
}: {
  defaultImage: string;
  opt?: any;
}) {
  // See https://github.com/facebook/react/pull/26940
  preload(defaultImage, opt);
  return null;
}

export default function Page() {
  const defaultImage = '/dingos/dingo.jpg';
  const srcSet =
    '/dingos/dingo_430.jpg 430w, /dingos/dingo_768.jpg 768w /dingos/dingo_1024.jpg 1024w';
  const sizes = '(max-width: 430px) 768px, 1024px, 1200px';
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Responsive Images (multiple assets)</h1>
      <h1>Image Component With Layout Responsive</h1>
      <picture>
        <source media="(max-width: 430px)" srcSet="/dingos/dingo_430.jpg" />
        <source media="(max-width: 768px)" srcSet="/dingos/dingo_768.jpg" />
        <source media="(min-width: 1024px)" srcSet="/dingos/dingo_1024.jpg" />
        <img src={defaultImage} alt="The big dingo" />
      </picture>

      <PreloadLink
        defaultImage={defaultImage}
        opt={{
          as: 'image',
          imageSrcSet: srcSet,
        }}
      />

      <ul>
        <li>
          Uses html <span className="text-amber-400">{'<picture/>'}</span> tag.
        </li>
        <li>
          Use <span className="text-amber-400">ReactDom.preload()</span> to
          create the prefetch link (same as a{' '}
          <Link href="https://github.com/vercel/next.js/blob/66f8ffaa7a834f6591a12517618dce1fd69784f6/packages/next/src/client/image-component.tsx#L332">
            NextJS source
          </Link>{' '}
          ).
        </li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images">
          Picture Docs
        </ExternalLink>
        <ExternalLink href="https://react.dev/reference/react-dom/preload">
          ReactDOM preload()
        </ExternalLink>
      </div>
    </div>
  );
}
