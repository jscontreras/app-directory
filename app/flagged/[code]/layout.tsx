import { ReactNode } from 'react';
import { generatePermutations } from '@vercel/flags/next';
import { barColor, featureFlags } from '#/flags';
import BottomBar from '#/ui/bottom-bar';
import { showBottomBar } from '#/flags';

export async function generateStaticParams() {
  const codes = await generatePermutations(featureFlags);
  return codes.map((code) => ({ code: `${code}` }));
}

export const revalidate = false; // Revalidate every 60 seconds

export default async function Layout(props: {
  children: ReactNode;
  params: Promise<{ code: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  // Reading Flag
  const bottomBar = await showBottomBar(params.code, featureFlags);
  const color = await barColor(params.code, featureFlags);

  return (
    <>
      {bottomBar && (
        <BottomBar
          message="&#127987; Hello World Featured Flag!"
          color={color}
        />
      )}
      {children}
    </>
  );
}
export const dynamicParams = false;
