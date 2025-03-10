'use client';
import { Analytics } from '@vercel/analytics/next';

function beforeSendHandler(data: any) {
  console.log('AnalyticsEvents', data);
  return data; // this will send the event as is
}

export function AnalyticsAdapter() {
  if (process.env.NODE_ENV !== 'production') {
    return (
      <Analytics
        beforeSend={beforeSendHandler}
        scriptSrc="/_vercel/insights/script.debug.js"
        debug={true}
      />
    );
  } else {
    return <Analytics beforeSend={beforeSendHandler} />;
  }
}
