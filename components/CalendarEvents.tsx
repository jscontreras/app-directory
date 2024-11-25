import { cache } from 'react';

const fetchCalendarEvents = cache(async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [
    { date: '2023-06-15', title: 'Team Meeting' },
    { date: '2023-06-18', title: 'Project Deadline' },
    { date: '2023-06-20', title: 'Client Presentation' },
  ];
});

export default async function CalendarEvents() {
  const events = await fetchCalendarEvents();

  return (
    <div className="widget bg-black">
      <h2 className="widget-title text-pink-600">Calendar Events</h2>
      <ul className="widget-list bg-black">
        {events.map((event, index) => (
          <li key={`event-${index}`} className="widget-list-item bg-black">
            <span className="font-medium">{event.title}</span>
            <span className="text-sm text-gray-500">{event.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
