'use client';

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/tLTr5zEhvLB
 */
import { Label } from '#/ui/ui/label';
import { Input } from '#/ui/ui/input';
import Link from 'next/link';
import { Button } from '#/ui/ui/button';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export function UrlEncodingForm() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const router = useRouter();
  const handleInputChange = (event: any) => {
    setQuery(event.target.value);
  };

  const handleRouteClick = () => {
    if (query.includes('&') || query.includes('%')) {
      router.push(`/query-params?q=${query}--router`, { scroll: false });
    } else {
      router.push(`/query-params?q=${encodeURIComponent(query)}--router`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="mb-4 mt-4 flex w-full max-w-md flex-col space-y-4">
      {params.get('q') && (
        <div className="p-4">
          <h2>
            Value:{' '}
            <span className="text-4xl text-fuchsia-400">{params.get('q')}</span>
          </h2>
        </div>
      )}
      <Label htmlFor="url">URL</Label>
      <Input
        id="url"
        className="focus:text-red-600"
        placeholder="Enter the value for the 'q' search param."
        type="text"
        value={query}
        onChange={handleInputChange}
      />
      <div className="flex space-x-2">
        <Link
          className="inline-flex items-center justify-center rounded-md border border-gray-200 border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:border-gray-800"
          href={
            query
              ? `/query-params?q=${
                  query.includes('&') || query.includes('%')
                    ? encodeURIComponent(query)
                    : query
                }--link`
              : `/query-params`
          }
          scroll={false}
        >
          Redirect Using Link
        </Link>
        <Button
          className="inline-flex items-center justify-center rounded-md border border-gray-200 border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 dark:border-gray-800"
          variant="outline"
          onClick={handleRouteClick}
        >
          Redirect Using Router.push
        </Button>
      </div>
    </div>
  );
}
