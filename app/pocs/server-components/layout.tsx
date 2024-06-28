import { Tab } from '#/ui/tab';
import { ExternalLink } from '#/ui/external-link';
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
        <Tab
          path="/pocs/server-components"
          item={{ text: 'Home' }}
          prefetch={false}
        />
        <Tab
          path="/pocs/server-components"
          item={{ text: 'Children Injection', slug: 'via-children' }}
          prefetch={false}
        />
        <Tab
          path="/pocs/server-components"
          item={{ text: 'Server Render Funcion', slug: 'via-render-fn' }}
          prefetch={false}
        />
        <Tab
          path="/pocs/server-components"
          item={{ text: 'Server Action Fetch', slug: 'via-server-actions' }}
          prefetch={false}
        />
        {/* <RandomPostTab path="/ssg2" /> */}
      </div>
      <div>{children}</div>
      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns">
          Composition Patterns Documentation
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/tree/main/app/pocs/server-components">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
