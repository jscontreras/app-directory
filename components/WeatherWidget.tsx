import { cache } from 'react';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';

const fetchWeatherData = cache(async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  const conditions = ['sunny', 'cloudy', 'rainy'];
  const randomCondition =
    conditions[Math.floor(Math.random() * conditions.length)];
  return {
    temp: Math.floor(Math.random() * 30) + 10,
    condition: randomCondition,
  };
});

export default async function WeatherWidget() {
  const weather = await fetchWeatherData();

  const WeatherIcon =
    weather.condition === 'sunny'
      ? WiDaySunny
      : weather.condition === 'cloudy'
      ? WiCloudy
      : WiRain;

  return (
    <div className="widget">
      <h2 className="widget-title text-yellow-600">Weather</h2>
      <div className="flex items-center justify-center">
        <WeatherIcon className="mr-4 text-6xl text-yellow-400" />
        <div>
          <p className="text-3xl font-bold">{weather.temp}°C</p>
          <p className="capitalize text-gray-500">{weather.condition}</p>
        </div>
      </div>
    </div>
  );
}
