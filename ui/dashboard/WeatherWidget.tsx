import styles from './WeatherWidget.module.css';
import { WiDaySunny, WiCloudy, WiRain } from 'react-icons/wi';

const fetchWeatherData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { temp: Math.floor(Math.random() * 30) + 10, condition: 'sunny' };
};

export default async function WeatherWidget() {
  const weather = await fetchWeatherData();

  const WeatherIcon =
    weather.condition === 'sunny'
      ? WiDaySunny
      : weather.condition === 'cloudy'
      ? WiCloudy
      : WiRain;

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Weather</h2>
      <div className={styles.content}>
        <WeatherIcon className={styles.icon} />
        <div>
          <p className={styles.temperature}>{weather.temp}°C</p>
          <p className={styles.condition}>{weather.condition}</p>
        </div>
      </div>
    </div>
  );
}
