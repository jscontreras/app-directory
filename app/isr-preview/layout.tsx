import { Tab } from '#/ui/tab';
import React from 'react';

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
        <Tab path="/isr-preview" item={{ text: 'Home' }} prefetch={false} />
        <Tab
          path="/isr-preview"
          item={{ text: 'Testing Post', slug: '1' }}
          prefetch={false}
        />
        {/* <RandomPostTab path="/ssg2" /> */}
      </div>
      <div>{children}</div>
    </div>
  );
}
