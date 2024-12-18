import { UnstableCacheInstructions } from '#/ui/unstable-cache-instructions';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-static';

const getDataFn = async (id: string) => {
  if (id === 'error') {
    throw new Error(
      `This is an error (Not caching) ${new Date().toISOString()}`,
    );
  }
  return { id: id, data: `Some data (caching) ${new Date().toISOString()}` };
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  try {
    const data = await unstable_cache(getDataFn, ['my-app-data'], {
      tags: ['default-tag'],
    })(id);

    // performing second one changing revalidate and tags
    await unstable_cache(getDataFn, ['my-app-data'], {
      tags: [`dynamic-tag-${id}`],
      revalidate: 20,
    })(id);
    return (
      <UnstableCacheInstructions dynamicTag={`dynamic-tag-${id}`}>
        <div>{data.data}</div>
      </UnstableCacheInstructions>
    );
  } catch (error) {
    // Ensure error is of type Error
    if (error instanceof Error) {
      return (
        <UnstableCacheInstructions>
          <div>Error: {error.message}</div>
        </UnstableCacheInstructions>
      );
    }
    // Handle case where error is not an Error object
    return (
      <UnstableCacheInstructions>
        <div>An unknown error occurred</div>
      </UnstableCacheInstructions>
    );
  }
}
