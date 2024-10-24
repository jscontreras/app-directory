import { UnstableCacheInstructions } from '#/ui/unstable-cache-instructions';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return <UnstableCacheInstructions></UnstableCacheInstructions>;
}
