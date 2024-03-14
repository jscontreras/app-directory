import { RevalidateButton } from '#/ui/revalidate-button';
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
        <RevalidateButton copy="Invalidate This Path" path={'/revalidate'} />
      </div>
      <div>{children}</div>
    </div>
  );
}

export const dynamic = 'force-static';
