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
        <Tab path="/suspense" item={{ text: 'Home' }} />
        <Tab
          path="/suspense"
          item={{
            text: 'Timezones',
            slug: 'timezones?city=New+York&timezone=America%2FNew_York',
          }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}

export const dynamic = 'force-static';
