'use client';

import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const validApps = ['https://svelte.tc-vercel.dev', 'http://localhost:5173'];

export default function EmbedPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeUrl =
    process.env.NODE_ENV == 'development' ? validApps[1] : validApps[0];
  useEffect(() => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    const domain =
      port && port !== '80' && port !== '443'
        ? `${protocol}//${hostname}:${port}`
        : `${protocol}//${hostname}`;
    const handleMessage = (event: MessageEvent) => {
      // https:// using vercel.live for flags sync
      if (event.origin === domain) {
        const oldCookieValue = Cookies.get('vercel-flag-mirror') || '';
        const vercelOverrides = Cookies.get('vercel-flag-overrides') || '';
        if (oldCookieValue != vercelOverrides) {
          Cookies.set('vercel-flag-mirror', vercelOverrides || '');
          sendMessageToIframe();
        }
      }

      // Ensure the message is from the iframe domain
      if (!validApps.includes(event.origin)) return;

      if (event.data.type === 'IFRAME_MESSAGE') {
        console.log('FROM:SVELTE APP>>', event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendMessageToIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const payload = Cookies.get('vercel-flag-overrides') || null;
      iframeRef.current.contentWindow.postMessage(
        { type: 'PARENT_MESSAGE', payload: payload ? payload : 'null' },
        iframeUrl,
      );
      setTimeout(() => {
        // reload iframe here
        if (iframeRef.current) {
          iframeRef.current.src = iframeRef.current.src;
        }
        console.log('Reloading IFRAME app');
      }, 1000);
    }
  };

  return (
    <div className="min-h-dvh bg-wh p-4">
      <h1 className="mb-4 text-2xl font-bold">Parent App</h1>
      <button
        onClick={sendMessageToIframe}
        className="mb-4 hidden rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        Sync Flags with Iframe
      </button>
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        width="100%"
        height="800"
        className="rounded border-2 border-gray-300 bg-white"
      />
    </div>
  );
}
