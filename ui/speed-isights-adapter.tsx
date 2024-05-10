'use client';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function SpeedInsightsAdapter() {
  return (
    <SpeedInsights
      beforeSend={(data) => {
        console.log('SpeedInsightsEvents', data);
        return data; // this will send the event as is
      }}
    />
  );
}
