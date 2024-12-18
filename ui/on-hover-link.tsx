'use client';

import { Tab } from '#/ui/tab';
import clsx from 'clsx';
import React from 'react';
import { Item } from './tab-group';

export function OnHoverLink({ path, item }: { path: string; item: Item }) {
  const [prefetch, setPrefetch] = React.useState<boolean>(false);

  // Handle mouse enter - enable prefetching
  const handleMouseEnter = () => {
    setPrefetch(true);
  };

  return (
    <div
      className={clsx('inline-flex opacity-100 transition')}
      onMouseEnter={handleMouseEnter}
    >
      <Tab path={path} item={item} prefetch={prefetch} />
    </div>
  );
}
