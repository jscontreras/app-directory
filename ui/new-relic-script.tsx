'use client';

import Script from 'next/script';

export function NewRelicBrowserAgentScript() {
  return <></>;
  // Disabling this for a moment
  if (process.env.NODE_ENV === 'production') {
    return <Script src="/js/nr-script.js" />;
  } else {
    return <></>;
  }
}
