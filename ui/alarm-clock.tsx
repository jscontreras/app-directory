import { ReactNode, cache } from 'react';
import SkeletonAlarmClock from './skeleton-alarm-clock';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getCurrentHourInCity = cache(async function (timezone: string) {
  `use server`;

  const res = await fetch(
    `https://worldtimeapi.org/api/ip`,
    // { next: { revalidate: 300, tags: ['timezone'] },
    { cache: 'force-cache' },
  );
  const data = (await res.json()) as { datetime: string };

  const currentTime = new Date(data.datetime).toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
  });
  await sleep(2000);
  return currentTime;
});

export default async function AlarmClock({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<ReactNode> {
  let serverHour = '';
  let serverMinutes = '';
  let serverCity = searchParams['city'] || '';
  let timezone = searchParams['timezone'] || '';
  if (timezone && typeof timezone === 'string') {
    // calling server function
    const time = await getCurrentHourInCity(timezone);
    serverHour = time.split(':')[0];
    serverMinutes = time.split(':')[1];
    console.log('searchParams', searchParams);
    return (
      <div className="min-h-5 dark flex items-center justify-center bg-black">
        <div className="rounded-full bg-black p-8 text-white shadow-lg">
          <div className="flex items-center justify-center space-x-8">
            <div className="relative">
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <div className="h-2 w-2 animate-ping rounded-full bg-white" />
              </div>
              <div className="relative text-6xl font-bold">
                {`${serverHour}`.padStart(2, '0')}
              </div>
            </div>
            <div className="text-6xl font-bold">:</div>
            <div className="relative block">
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
                <div className="h-2 w-2 animate-ping rounded-full bg-white" />
              </div>
              <div className="relative text-6xl font-bold">
                {`${serverMinutes}`.padStart(2, '0')}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-2xl font-bold">{`${serverCity}`}</div>
        </div>
      </div>
    );
  } else {
    // Add delay to make suspense evident.
    return <SkeletonAlarmClock message="Please Select a City" />;
  }
}
