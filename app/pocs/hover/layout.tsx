import { OnHoverLink } from '#/ui/on-hover-link';
import { RandomPostTab } from '#/ui/random-post-tab';
import { Tab } from '#/ui/tab';
import React from 'react';

const title = 'Incremental Static Regeneration (ISR)';

export const metadata = {
  title,
  openGraph: {
    title,
    images: [`/api/og?title=${title}`],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-9">
      <div className="flex flex-wrap items-center gap-2">
        <Tab path="/pocs/hover" item={{ text: 'Home' }} prefetch={false} />
        <Tab
          path="/pocs/hover"
          item={{ text: 'Post 1 (disabled)', slug: '1' }}
          prefetch={false}
        />
        <OnHoverLink
          path="/pocs/hover"
          item={{ text: 'Post 2 (on hover)', slug: '2' }}
        />
        <RandomPostTab path="/pocs/hover" />
      </div>

      <div>{children}</div>
    </div>
  );
}

export const dynamic = 'force-static';
