import { cache } from 'react';

const fetchUserActivity = cache(async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { user: 'Alice', action: 'Logged in', time: '2 minutes ago' },
    { user: 'Bob', action: 'Updated profile', time: '5 minutes ago' },
    { user: 'Charlie', action: 'Posted a comment', time: '10 minutes ago' },
  ];
});

export default async function UserActivity() {
  const activity = await fetchUserActivity();

  return (
    <div className="rounded-lg bg-black p-4 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-green-600">
        User Activity
      </h2>
      <ul className="space-y-2">
        {activity.map((item) => (
          <li
            key={`activity-${item.user}`}
            className="flex items-center justify-between border-b pb-2"
          >
            <span className="font-medium">{item.user}</span>
            <span className="text-sm text-gray-500">{item.action}</span>
            <span className="text-xs text-gray-400">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
