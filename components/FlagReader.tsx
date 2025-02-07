'use client';

import { useEffect } from 'react';
import { useFlagValues } from '@vercel/flags/react';

export function FlagReader() {
  const flags = useFlagValues();

  useEffect(() => {
    console.log('Flag values:', flags);
  }, [flags]);

  return null;
}
