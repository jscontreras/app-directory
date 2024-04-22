/* eslint-disable @next/next/no-img-element */
import '#/styles/responsive-images.scss';
import { ExternalLink } from '#/ui/external-link';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import dingoMobile from '#/public/dingos/dingo_768.jpg';
import dingo from '#/public/dingos/dingo_1024.jpg';

/*
 * Wrapper for NextJs images
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
  const src = '/dingos/dingo.jpg';
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Responsive Images (multiple assets)</h1>
      <h1>Image Component With Layout Responsive</h1>

      <ResponsiveImageNext src={src} mobileSrc={dingoMobile} alt={'Dingo'} />

      {/* <picture>
        <source media="(max-width: 430px)" srcSet="/dingos/dingo_430.jpg" />
        <source media="(max-width: 768px)" srcSet="/dingos/dingo_768.jpg" />
        <source media="(min-width: 1024px)" srcSet="/dingos/dingo_1024.jpg" />
        <img src={defaultImage} alt="The big dingo" />
      </picture> */}

      {/* <PreloadLink
        defaultImage={defaultImage}
        opt={{
          as: 'image',
          imageSrcSet: srcSet,
        }}
      /> */}

      <ul>
        <li>
          Uses Nextjs <span className="text-amber-400">{'<Image/>'}</span>{' '}
          component.
        </li>
        <li>
          The smaller image is configured to render only screens smaller than
          768px via the <span className="text-amber-400">{'sizes'}</span>{' '}
          attribute.
        </li>
        <li>
          The bigger image is configured to render only on screens bigger than
          768px via the <span className="text-amber-400">{'sizes'}</span>{' '}
          attribute.
        </li>
        <li>
          Both images use the <span className="text-amber-400">priority</span>{' '}
          attribute to enable prefetching.
        </li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/app/responsive-image/picture/page.tsx">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
