import '#/styles/globals.css';
import { GlobalNav } from './global-nav';
import { AddressBar } from './address-bar';
import Byline from './byline';
import { useState } from 'react';
const title = 'Static Data';

export const metadata = {
  title,
  openGraph: {
    title,
    images: [`/api/og?title=${title}`],
  },
};

function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="[color-scheme:dark]">
      <div className="bg-gray-1100 min-h-screen overflow-y-scroll bg-[url('/grid.svg')] pb-36">
        <GlobalNav />
        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
            <div className="bg-vc-border-gradient rounded-lg p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <AddressBar />
              </div>
            </div>
            <div className="bg-vc-border-gradient rounded-lg p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
            </div>
            <Byline className="fixed sm:hidden" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RevalidatePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <div className="space-y-9">
        <div className="flex flex-wrap items-center gap-2">
          <RevalidateButton
            copy="Invalidate via Path"
            path={'/pages/revalidate'}
          />
        </div>
        <div>{children}</div>
      </div>
    </PageLayout>
  );
}

export const RevalidateButton = ({
  path,
  copy,
}: {
  path: string;
  copy: string;
}) => {
  const [active, setActive] = useState(true);
  async function btnClickHandler() {
    if (!active) {
      return;
    }
    setActive(false);
    const options = { method: 'GET' };
    await fetch('/api/pages/revalidate', options);
    alert(`Revalidated (${path})`);
    //location.reload();
  }
  return (
    <button
      className={`${
        active ? 'bg-vercel-blue' : 'bg-vercel-violet'
      } rounded-lg px-3 py-1 text-sm font-medium text-white`}
      onClick={btnClickHandler}
    >
      {copy}
    </button>
  );
};
