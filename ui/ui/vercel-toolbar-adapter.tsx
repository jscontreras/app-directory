'use client';
import { mountVercelToolbar, unmountVercelToolbar } from '@vercel/toolbar';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VercelToolbarAdapter() {
  const [toolbarState, setToolbarState] = useState({ initialized: false });
  const pathname = usePathname();
  useEffect(() => {
    if (!toolbarState.initialized) {
      if (pathname === '/pocs/toolbar') {
        // Cookies.set("flags_site", "https://svelte.tc-vercel.dev", { expires: 30 })
        mountVercelToolbar();
        setToolbarState({ initialized: true });
      } else {
        Cookies.remove('flags_site');
        unmountVercelToolbar();
        mountVercelToolbar();
        setToolbarState({ initialized: true });
      }
    }
  }, [toolbarState, pathname]);
  return null;
}
