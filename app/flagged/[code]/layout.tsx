import { ReactNode } from 'react';
import { unstable_generatePermutations as generatePermutations } from '@vercel/flags/next';
import { featureFlags } from '#/flags';

export async function generateStaticParams() {
  const codes = await generatePermutations(featureFlags);
  return codes.map((code) => ({ code: `${code}` }));
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Layout({ children }: { children: ReactNode }) {
  return children;
}
