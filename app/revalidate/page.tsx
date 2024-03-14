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
  await delay(20000);
  const date = formatDate(new Date());
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Revalidating Path</h1>

      <ul>
        <li>This page takes 20 seconds to be rendered</li>
        <li>{date}</li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#static-data-fetching">
          Docs
        </ExternalLink>
        <ExternalLink href="https://github.com/vercel/app-playground/tree/main/app/ssg">
          Code
        </ExternalLink>
      </div>
    </div>
  );
}
