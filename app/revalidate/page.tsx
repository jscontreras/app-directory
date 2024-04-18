import { ExternalLink } from '#/ui/external-link';

// Function to format the date and time
function formatDate(date: Date) {
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();
  let seconds: any = date.getSeconds();

  // Ensuring two digits for hours, minutes, and seconds
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Formatting the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns month from 0-11
  const day = date.getDate();

  // Returning the formatted string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to create a delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Page() {
  await delay(9000);
  const res = await fetch(`https://worldtimeapi.org/api/ip`, {
    next: { tags: ['test-tag'] },
  });
  const data = (await res.json()) as { datetime: string };
  const dateObj = new Date(data.datetime);
  const currentTime = dateObj.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const postId = dateObj.getSeconds();
  // second request
  const resLorem = await fetch(`https://jsonplaceholder.typicode.com/posts/3`, {
    next: { tags: ['test-tag-2'] },
  });

  const dataLorem = (await resLorem.json()) as { title: string; body: string };

  const date = currentTime;
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Revalidating Path</h1>

      <ul>
        <li>This page takes 10 seconds to be rendered (when not cached)</li>
        <li>Time in New York: {date} (obtained via fetch)</li>
        <li>Lorem ipsum post (obtained via fetch)</li>
        <li>It contains two fetched requests tagged with unique tags.</li>
        <li>
          When invalidating via tags, only one fetch tag is referenced but
          everything gets uncached (path and fetches).
        </li>
      </ul>
      <div className="mb-8 grid grid-cols-6 gap-x-6 gap-y-3">
        <div className="col-span-full space-y-3 lg:col-span-4">
          <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
            {dataLorem.title} [{postId}]
          </h1>
          <p className="line-clamp-3 font-medium text-gray-500">
            {dataLorem.body}
          </p>
          {/* client component */}
        </div>
      </div>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#static-data-fetching">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/jscontreras/app-directory/blob/main/app/revalidate/page.tsx">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
