'use client';

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';

const iframeUrl = 'https://svelte.tc-vercel.dev';

export default function EmbedPage() {
  const [message, setMessage] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from the iframe domain
      if (event.origin !== iframeUrl) return;

      if (event.data.type === 'IFRAME_MESSAGE') {
        setMessage(event.data.payload);
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
      console.log('Message sent!', payload);
    }
  };

  // Example of setting a cookie using js-cookie
  const setCookieExample = () => {
    Cookies.set('exampleCookie', 'Hello from js-cookie!', { expires: 7 });
  };

  // Example of removing a cookie using js-cookie
  const removeCookieExample = () => {
    Cookies.remove('exampleCookie');
  };

  return (
    <div className="min-h-dvh bg-wh p-4">
      <h1 className="mb-4 text-2xl font-bold">Parent App</h1>
      <button
        onClick={sendMessageToIframe}
        className="mb-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        Sync Flags with Iframe
      </button>

      <button
        onClick={setCookieExample}
        className="mb-4 ml-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Set Cookie Example
      </button>

      <button
        onClick={removeCookieExample}
        className="mb-4 ml-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      >
        Remove Cookie Example
      </button>

      {message && <p className="mb-4">Message from iframe: {message}</p>}
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
