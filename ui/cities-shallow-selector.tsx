'use client';
import { useState } from 'react';

/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/Rv2NwAfLFsP
 */

import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from './ui/select';
import AlarmClockClient from './alarm-clock-client';
import { useSearchParams } from 'next/navigation';

const cities = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Beijing', timezone: 'Asia/Shanghai' },
  { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo' },
  { name: 'Cape Town', timezone: 'Africa/Johannesburg' },
  // Add more cities with their timezones
];

export function CitiesShallowSelector({
  componentType,
}: {
  componentType: string;
}) {
  const params = useSearchParams();
  const [city, setCity] = useState({
    city: params.get('city') || '',
    timezone: params.get('timezone') || '',
  });

  function updateUrlCityParams(city: string) {
    const params = new URLSearchParams(window.location.search);
    params.set('city', city);
    const timezone = cities.find((cityObj) => cityObj.name === city);
    if (timezone) {
      params.set('timezone', timezone.timezone);
      // https://nextjs.org/docs/app/api-reference/functions/use-router
      window.history.pushState(null, '', `?${params.toString()}`);
      setCity({ city: city, timezone: timezone.timezone || '' });
    }
  }

  return (
    <>
      <div className="m-2 border-2 border-dashed p-2 ">
        <h2>{`<Client Component/>`}</h2>
        <Select onValueChange={updateUrlCityParams} defaultValue={city.city}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {cities.map((city) => (
                <SelectItem
                  key={`${city.name}`}
                  value={`${city.name}`}
                >{`${city.name}`}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="m-2 border-2 border-dashed p-2 ">
        <h2>{`<${componentType} Component/>`}</h2>
        <AlarmClockClient city={city.city} timezone={city.timezone} />
      </div>
    </>
  );
}
