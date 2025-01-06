'use client';
import { SpeedInsights } from '@vercel/speed-insights/next';

function beforeSendHandler(data: any) {
  console.log('SpeedInsightsEvents', data);
  return data; // this will send the event as is
}

export function SpeedInsightsAdapter() {
  if (process.env.NODE_ENV !== 'production') {
    return (
      <SpeedInsights
        beforeSend={beforeSendHandler}
        endpoint="https://tc-vercel.dev/_vercel/speed-insights/script.js"
      />
    );
  } else {
    return <SpeedInsights beforeSend={beforeSendHandler} />;
  }
}
