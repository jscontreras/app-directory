import styles from './CalendarEvents.module.css';

const fetchCalendarEvents = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { date: '2023-06-15', title: 'Team Meeting' },
    { date: '2023-06-18', title: 'Project Deadline' },
    { date: '2023-06-20', title: 'Client Presentation' },
  ];
};

export default async function CalendarEvents() {
  const events = await fetchCalendarEvents();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>Calendar Events</h2>
      <ul className={styles.list}>
        {events.map((event, index) => (
          <li key={`event-${index}`} className={styles.item}>
            <span className={styles.eventTitle}>{event.title}</span>
            <span className={styles.eventDate}>{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
