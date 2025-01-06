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
        endpoint="https://www.tc-vercel.dev/_vercel/insights/script.js"
      />
    );
  } else {
    return <Analytics beforeSend={beforeSendHandler} />;
  }
}
