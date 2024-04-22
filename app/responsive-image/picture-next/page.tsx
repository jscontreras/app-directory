import '#/styles/responsive-images.scss';
import { ExternalLink } from '#/ui/external-link';
import Image, { StaticImageData } from 'next/image';
import dingoMobile from '#/public/dingos/dingo_768.jpg';
import dingo from '#/public/dingos/dingo_1024.jpg';
import { ShowResponsiveImages } from '#/ui/show-responsove-image';
import Link from 'next/link';

/*
 * Wrapper for NextJs images that renders two images if providing a mobile asset src.
 * @param defaultImage
 * @param mobileImage
 */
function ResponsiveImageNext({
  src,
  alt,
  mobileSrc = null,
  opt = {},
}: {
  src: string;
  alt: string;
  mobileSrc?: StaticImageData | null;
  opt?: object;
}) {
  if (mobileSrc) {
    return (
      <div className="responsive-images">
        <Image
          src={mobileSrc}
          alt={alt}
          sizes="(max-width: 767px) 100vw, 0vw"
          priority
          {...opt}
          className="mobile-pic"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
        <Image
          alt={alt}
          sizes="(min-width: 768px) and (max-width: 1440px) 100vw, (min-width: 1440px) 1440px, 0vw"
          src={src}
          width={767}
          height={767}
          priority
          className="desktop-pic"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    );
  } else {
    return (
      <>
        <Image src={dingo} alt={alt} priority />
      </>
    );
  }
}

export default function Page() {
  const extDocUrl =
    'https://css-tricks.com/improve-largest-contentful-paint-lcp-on-your-website-with-ease/#aa-2-preload-critical-resources';
  const src = '/dingos/dingo.jpg';
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        {`Responsive Images (multiple assets + `}
        <a href={extDocUrl} target="_blank" rel="noreferrer">
          LCP optimization
        </a>
        )
      </h1>
      <h1>Image Component With Layout Responsive</h1>
      <ResponsiveImageNext src={src} mobileSrc={dingoMobile} alt={'Dingo'} />
      <p className="pl-2">
        {`Even when this demo preloads both images (desktop & `}
        <span className="text-emerald-400">mobile</span>
        {`) it will load a small blurred image (16x16) for the one that doesn't match screen width
       specified in the `}
        <span className="text-amber-400">{' sizes '}</span>
        {` attribute.`}
      </p>
      <p className="pl-2">
        <ShowResponsiveImages />
      </p>
      <ul>
        <li>
          Uses Nextjs <span className="text-amber-400">{'<Image/>'}</span>
          component.
        </li>
        <li>
          The smaller image is configured to render only screens smaller than
          768px via the <span className="text-amber-400">{'sizes '}</span>
          attribute.
        </li>
        <li>
          The bigger image is configured to render only on screens bigger than
          768px via the <span className="text-amber-400">{'sizes '}</span>
          attribute.
        </li>
        <li>
          Both images use the <span className="text-amber-400">priority </span>
          attribute to enable prefetching.
        </li>
        <li>
          Additional CSS code is added to hide the corresponding image beased on
          media queries.
        </li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/pages/api-reference/components/image#sizes">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/app/responsive-image/picture-next/page.tsx">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
