export default function AlarmClock({
  hour,
  minutes,
  cityName,
  cityTimezone,
}: {
  hour?: Number;
  minutes?: Number;
  cityName?: String;
  cityTimezone?: String;
}) {
  let serverHour = hour;
  let serverMinutes = minutes;
  let serverCity = cityName;
  let serverTimezone = cityTimezone;

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
}
