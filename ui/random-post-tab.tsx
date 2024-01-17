'use client';

import { Tab } from '#/ui/tab';
import clsx from 'clsx';
import React, { useEffect } from 'react';

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export function RandomPostTab({ path }: { path: string }) {
  const [post, setPost] = React.useState<{
    text: string;
    slug: string;
    time: number;
  }>({
    text: '',
    slug: '',
    time: 5,
  });
  useEffect(() => {
    if (post.time >= 1) {
      setTimeout(() => {
        if (post.time === 1) {
          const randomId = String(randomNumber(3, 100));
          setPost({
            text: `Post ${randomId} (On Demand)`,
            slug: randomId,
            time: 0,
          });
        } else {
          setPost({ ...post, time: post.time - 1 });
        }
      }, 1000);
    }
  }, [post]);

  return (
    <div
      className={clsx('inline-flex transition', {
        'opacity-50': post.time > 0,
        'opacity-100': post.time === 0,
      })}
    >
      {post.time === 0 ? (
        <Tab path={path} item={{ text: post.text, slug: post.slug }} />
      ) : (
        <span
          className={clsx(
            'rounded-lg px-3 py-1 text-sm font-medium text-white',
            {
              'bg-gray-700 text-gray-100 hover:bg-gray-500 hover:text-white':
                post.time > 0,
              'bg-vercel-blue text-white': post.time === 0,
            },
          )}
        >
          Generating Link {`${post.time}s`}
        </span>
      )}
    </div>
  );
}
