'use client';
import { mountVercelToolbar, unmountVercelToolbar } from '@vercel/toolbar';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function VercelToolbarAdapter() {
  const pathname = usePathname();
  const [toolbarState, setToolbarState] = useState({
    initialized: false,
    pathname: pathname,
  });
  useEffect(() => {
    const asyncVercelBarLoading = async () => {
      if (
        pathname != toolbarState.pathname ||
        toolbarState.initialized == false
      ) {
        if (pathname === '/pocs/toolbar') {
          Cookies.set('flags_site', 'https://svelte.tc-vercel.dev', {
            expires: 30,
          });
          unmountVercelToolbar();
          await sleep(1000);
          mountVercelToolbar();
          setToolbarState({ pathname: pathname, initialized: true });
        } else {
          Cookies.remove('flags_site');
          if (toolbarState.pathname === '/pocs/toolbar') {
            unmountVercelToolbar();
          }
          await sleep(5000);
          mountVercelToolbar();
          setToolbarState({ pathname: pathname, initialized: true });
        }
        console.log('Toolbar Repainted!!');
      }
    };
    asyncVercelBarLoading();
  }, [pathname]);
  return null;
}
