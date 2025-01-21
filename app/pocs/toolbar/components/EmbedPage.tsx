'use client';

import { useState, useEffect, useRef } from 'react';

const iframeUrl = 'https://svelte.tc-vercel.dev';

export default function EmbedPage() {
  const [message, setMessage] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from the iframe domain
      console.log('event', event);
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
      iframeRef.current.contentWindow.postMessage(
        { type: 'PARENT_MESSAGE', payload: 'Activate your Toolbar' },
        iframeUrl,
      );
      console.log('Message sent!');
    }
  };

  return (
    <div className="min-h-dvh bg-wh p-4">
      <h1 className="mb-4 text-2xl font-bold">Parent App</h1>
      <button
        onClick={sendMessageToIframe}
        className="mb-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        Send Message to Iframe
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
