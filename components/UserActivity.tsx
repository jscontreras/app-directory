import styles from './UserActivity.module.css';

const fetchUserActivity = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { user: 'Alice', action: 'Logged in', time: '2 minutes ago' },
    { user: 'Bob', action: 'Updated profile', time: '5 minutes ago' },
    { user: 'Charlie', action: 'Posted a comment', time: '10 minutes ago' },
  ];
};

export default async function UserActivity() {
  const activity = await fetchUserActivity();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>User Activity</h2>
      <ul className={styles.list}>
        {activity.map((item, index) => (
          <li key={`activity-${index}`} className={styles.item}>
            <span className={styles.user}>{item.user}</span>
            <span className={styles.action}>{item.action}</span>
            <span className={styles.time}>{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
