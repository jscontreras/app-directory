import { cache } from 'react';

const widgets = [
  'AnalyticsChart',
  'UserActivity',
  'WeatherWidget',
  'TodoList',
  'NewsFeeds',
  'StockTicker',
  'CalendarEvents',
  'PerformanceMetrics',
  'SocialMediaFeed',
  'SystemStatus',
];

export const getActiveWidgets = cache(async () => {
  // Simulate fetching active widgets from a database or API
  await new Promise((resolve) => setTimeout(resolve, 100));
  const widgetCount = Math.floor(Math.random() * 5) + 1;
  const res = widgets.sort(() => 0.5 - Math.random()).slice(0, widgetCount);
  console.log('!!!!!', res);
  return res;
});
