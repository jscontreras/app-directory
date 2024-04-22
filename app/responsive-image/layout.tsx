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
        <Tab path="/responsive-image" item={{ text: 'Same Image' }} />
        <Tab
          path="/responsive-image"
          item={{ text: 'Different Images (NextImage)', slug: 'picture-next' }}
        />
        <Tab
          path="/responsive-image"
          item={{ text: 'Different Images (html)', slug: 'picture' }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
