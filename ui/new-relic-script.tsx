'use client';

import Script from 'next/script';

export function NewRelicBrowserAgentScript() {
  return <Script src="/js/nr-script.js" />;
}
