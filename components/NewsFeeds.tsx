import { cache } from 'react';

const fetchNewsFeeds = cache(async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { title: 'New AI breakthrough', source: 'Tech Daily' },
    { title: 'Stock market hits record high', source: 'Finance Today' },
    { title: 'Climate change summit concludes', source: 'World News' },
  ];
});

export default async function NewsFeeds() {
  const news = await fetchNewsFeeds();

  return (
    <div className="widget">
      <h2 className="widget-title text-red-600">News Feeds</h2>
      <ul className="widget-list">
        {news.map((item, index) => (
          <li key={`news-${index}`} className="widget-list-item">
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
