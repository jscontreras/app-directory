import { RevalidateButton } from '#/ui/revalidate-button';
import { RevalidateTagButton } from '#/ui/revalidate-tag-button';
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
        <RevalidateButton copy="Invalidate via Path" path={'/revalidate'} />
        <RevalidateTagButton
          copy="Invalidate via Lorem Post Tag"
          tag={'test-tag-post'}
        />
        <RevalidateTagButton
          copy="Invalidate via Date Tag"
          tag={'test-tag-date'}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}

export const dynamic = 'force-static';
