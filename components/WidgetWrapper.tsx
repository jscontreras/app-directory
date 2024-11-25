import dynamic from 'next/dynamic';

const widgets = {
  UserActivity: dynamic(() => import('./UserActivity') as any),
  WeatherWidget: dynamic(() => import('./WeatherWidget') as any),
  TodoList: dynamic(() => import('./TodoList') as any),
  NewsFeeds: dynamic(() => import('./NewsFeeds') as any),
  StockTicker: dynamic(() => import('./StockTicker') as any),
  CalendarEvents: dynamic(() => import('./CalendarEvents') as any),
  PerformanceMetrics: dynamic(() => import('./PerformanceMetrics') as any),
  SocialMediaFeed: dynamic(() => import('./SocialMediaFeed') as any),
  SystemStatus: dynamic(() => import('./SystemStatus') as any),
};

export default function WidgetWrapper({ widgetName }: { widgetName: string }) {
  const Widget = widgets[widgetName as keyof typeof widgets];
  return Widget ? <Widget /> : null;
}
