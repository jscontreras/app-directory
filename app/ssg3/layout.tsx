import { Tab } from '#/ui/tab';
import React from 'react';
// import { RandomPostTab } from '#/ui/random-post-tab';

const title = 'Static Data';

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
        <Tab path="/ssg3" item={{ text: 'Home' }} prefetch={false} />
        <Tab
          path="/ssg3"
          item={{ text: 'Post 1', slug: '1' }}
          prefetch={false}
        />
        <Tab
          path="/ssg3"
          item={{ text: 'Post 2', slug: '2' }}
          prefetch={false}
        />
        {/* <RandomPostTab path="/ssg3" /> */}
      </div>
      <div>{children}</div>
    </div>
  );
}
