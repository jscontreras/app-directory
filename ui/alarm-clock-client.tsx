'use client';

import React, { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import SkeletonAlarmClock from './skeleton-alarm-clock';
import { getCurrentHourInCityServerAction } from '#/lib/actions';

export default function AlarmClockClient({
  city,
  timezone,
}: {
  city?: string;
  timezone?: string;
}) {
  const [timeObject, setTimeObject] = useState({
    serverCity: '',
    serverHour: '--',
    serverMinutes: '--',
    serverTimezone: '',
  });

  // THis will only occur in the client
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('city') && searchParams.has('timezone')) {
      // Get data from Server
      const tTimezone = searchParams.get('timezone') || '';
      const tCity = searchParams.get('timezone') || '';
      if (tTimezone && tCity) {
        getCurrentHourInCityServerAction(tTimezone).then((value: string) => {
          setTimeObject({
            serverCity: tCity,
            serverTimezone: tTimezone,
            serverHour: value.split(':')[0],
            serverMinutes: value.split(':')[1],
          });
        });
      }
    }
  }, [timezone]);

  if (timezone) {
    return (
      <div className="min-h-5 dark flex items-center justify-center bg-black">
        <div className="rounded-full bg-black p-8 text-white shadow-lg">
          <div className="flex items-center justify-center space-x-8">
            <div className="relative">
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <div className="h-2 w-2 animate-ping rounded-full bg-white" />
              </div>
              <div className="relative text-6xl font-bold">
                {`${timeObject.serverHour}`.padStart(2, '0')}
              </div>
            </div>
            <div className="text-6xl font-bold">:</div>
            <div className="relative block">
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <div className="h-2 w-2 animate-ping rounded-full bg-white" />
              </div>
              <div className="relative text-6xl font-bold">
                {`${timeObject.serverMinutes}`.padStart(2, '0')}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-2xl font-bold">{`${timeObject.serverCity}`}</div>
        </div>
      </div>
    );
  } else {
    // Add delay to make suspense evident.
    return <SkeletonAlarmClock message="Please Select a City" />;
  }
}
