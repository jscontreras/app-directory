import { cache } from 'react';

const fetchSystemStatus = cache(async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { service: 'Web Server', status: 'Operational', uptime: '99.9%' },
    { service: 'Database', status: 'Operational', uptime: '99.99%' },
    { service: 'API', status: 'Partial Outage', uptime: '95.5%' },
  ];
});

export default async function SystemStatus() {
  const status = await fetchSystemStatus();

  return (
    <div className="widget">
      <h2 className="widget-title text-cyan-600">System Status</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Service</th>
            <th className="text-left">Status</th>
            <th className="text-left">Uptime</th>
          </tr>
        </thead>
        <tbody>
          {status.map((item, index) => (
            <tr key={`status-${index}`}>
              <td className="font-medium">{item.service}</td>
              <td
                className={
                  item.status === 'Operational'
                    ? 'text-green-500'
                    : 'text-red-500'
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
