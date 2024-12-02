import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  // printDiskSize();
  // Generate two pages at build time and the rest (5-100) on-demand
  return [
    { id: '1' },
    { id: '2' },
    { id: '0' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (Number(params.id) >= 100) {
    notFound();
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    { next: { revalidate: false } },
  );

  const data = (await res.json()) as { title: string; body: string };

  console.log(`Rendering from server ssg (compute)[id:${params.id}].`);
  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {data.title}
        </h1>
        <p className="line-clamp-3 font-medium text-gray-500">{data.body}</p>
        {/* client component */}
      </div>
    </div>
  );
}

export const dynamicParams = false;
