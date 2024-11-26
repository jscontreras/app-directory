import styles from './NewsFeeds.module.css';

const fetchNewsFeeds = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { title: 'New AI breakthrough', source: 'Tech Daily' },
    { title: 'Stock market hits record high', source: 'Finance Today' },
    { title: 'Climate change summit concludes', source: 'World News' },
  ];
};

export default async function NewsFeeds() {
  const news = await fetchNewsFeeds();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>News Feeds</h2>
      <ul className={styles.list}>
        {news.map((item, index) => (
          <li key={`news-${index}`} className={styles.item}>
            <h3 className={styles.newsTitle}>{item.title}</h3>
            <p className={styles.source}>{item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
