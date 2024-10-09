import { ReactNode } from 'react';
import { unstable_generatePermutations as generatePermutations } from '@vercel/flags/next';
import { featureFlags } from '#/flags';
import BottomBar from '#/ui/bottom-bar';
import { showBottomBar } from '#/flags';

export async function generateStaticParams() {
  const codes = await generatePermutations(featureFlags);
  return codes.map((code) => ({ code: `${code}` }));
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { code: string };
}) {
  // Reading Flag
  const bottomBar = await showBottomBar(params.code, featureFlags);

  return (
    <>
      {bottomBar && (
        <BottomBar message="&#127987; Hello World Featured Flag!" />
      )}
      {children}
    </>
  );
}
