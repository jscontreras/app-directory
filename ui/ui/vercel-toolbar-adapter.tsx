'use client';
import { mountVercelToolbar } from '@vercel/toolbar';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VercelToolbar } from '@vercel/toolbar/next';

export default function VercelToolbarAdapter() {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
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
          mountVercelToolbar();
          setToolbarState({ pathname: pathname, initialized: true });
        } else {
          if (Cookies.get('flags_site')) {
            Cookies.remove('flags_site');
            mountVercelToolbar();
            setToolbarState({ pathname: pathname, initialized: true });
            console.log('Toolbar Repainted!!');
          }
        }
      }
    };
    asyncVercelBarLoading();
  }, [pathname]);
  return shouldInjectToolbar ? <VercelToolbar /> : null;
}
