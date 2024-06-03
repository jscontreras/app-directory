import '#/styles/globals.css';
import { GlobalNav } from './global-nav';
import { AddressBar } from './address-bar';
import Byline from './byline';
import { useState } from 'react';
import Link from 'next/link';

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
  id,
}: {
  children: React.ReactNode;
  id?: number | string | null;
}) {
  return (
    <PageLayout>
      <div className="">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex w-full">
            <ButtonLink
              title="Home"
              id={id}
              href="/pages/revalidate"
              prefetch={false}
              active={id == null}
            />
            <ButtonLink
              title="Static [1]"
              id={id}
              href="/pages/revalidate/static-1"
              prefetch={true}
              active={id == '1'}
            />
            <ButtonLink
              title="ISR [3]"
              id={id}
              href="/pages/revalidate/3"
              prefetch={true}
              active={id === '3'}
            />
          </div>
          <div className="prose prose-sm prose-invert mt-8 max-w-none">
            <h1 className="w-full text-xl font-bold">
              Cache Revalidation Controllers
            </h1>
            <div className="mt-0 flex w-full">
              <RevalidateButton
                copy="Revalidate ALL paths"
                path={'/pages/revalidate'}
              />
              <RevalidateButton
                copy="Revalidate Static [1]"
                path={'/pages/revalidate/static-1'}
                apiEndpoint="/api/pages/revalidate/static-1"
              />
              <RevalidateButton
                copy="Revalidate ISR [3]"
                path={'/pages/revalidate/3'}
                apiEndpoint="/api/pages/revalidate/3"
              />
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </PageLayout>
  );
}

export const RevalidateButton = ({
  path,
  copy,
  apiEndpoint = '/api/pages/revalidate',
}: {
  path: string;
  copy: string;
  apiEndpoint?: string;
}) => {
  const [active, setActive] = useState(true);
  async function btnClickHandler() {
    if (!active) {
      return;
    }
    setActive(false);
    const options = { method: 'GET' };
    await fetch(apiEndpoint, options);
    alert(`Revalidated (${path})`);
    //location.reload();
  }
  return (
    <div className="mr-3">
      <button
        className={`${
          active ? 'bg-orange-600' : 'bg-vercel-violet'
        } rounded-lg px-3 py-1 text-sm font-medium text-white`}
        onClick={btnClickHandler}
      >
        {copy}
      </button>
    </div>
  );
};

function ButtonLink({ title, href, active, prefetch }: any) {
  return (
    <Link
      className={`mr-2  ${
        active ? 'bg-vercel-blue' : 'bg-gray-700'
      } rounded-lg px-3 py-1 text-sm font-medium text-white`}
      href={href}
    >
      {title}
    </Link>
  );
}
