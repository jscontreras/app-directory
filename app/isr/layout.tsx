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
        <Tab path="/isr" item={{ text: 'Home' }} />
        <Tab path="/isr" item={{ text: 'Post 1', slug: '1' }} />
        <Tab path="/isr" item={{ text: 'Post 2', slug: '2' }} />
        <RandomPostTab path="/isr" />
      </div>

      <div>{children}</div>
    </div>
  );
}

export const dynamic = 'force-static';
