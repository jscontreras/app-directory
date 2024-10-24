import { UnstableCacheInstructions } from '#/ui/unstable-cache-instructions';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

// Define an interface for our data structure
interface CachedData {
  id: string;
  data: string;
}

// Define the type for our cache function
type CacheFunction = (id: string) => Promise<CachedData>;

const getCachedData: CacheFunction = unstable_cache(
  async (id: string) => {
    if (id === 'error') {
      throw new Error(
        `This is an error (Not caching) ${new Date().toISOString()}`,
      );
    }
    return { id: id, data: `Some data (caching) ${new Date().toISOString()}` };
  },
  ['my-app-data'],
);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  try {
    const data = await getCachedData(id);
    return (
      <UnstableCacheInstructions>
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
