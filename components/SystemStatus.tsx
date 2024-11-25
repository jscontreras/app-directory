import styles from './SystemStatus.module.css';

const fetchSystemStatus = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { service: 'Web Server', status: 'Operational', uptime: '99.9%' },
    { service: 'Database', status: 'Operational', uptime: '99.99%' },
    { service: 'API', status: 'Partial Outage', uptime: '95.5%' },
  ];
};

export default async function SystemStatus() {
  const status = await fetchSystemStatus();

  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>System Status</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Uptime</th>
          </tr>
        </thead>
        <tbody>
          {status.map((item, index) => (
            <tr key={`status-${index}`}>
              <td className={styles.service}>{item.service}</td>
              <td
                className={
                  item.status === 'Operational'
                    ? styles.operational
                    : styles.outage
                }
              >
                {item.status}
              </td>
              <td>{item.uptime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
