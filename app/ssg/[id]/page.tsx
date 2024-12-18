import { getISODateServerAction } from '#/lib/actions';
import { RenderingInfo } from '#/ui/rendering-info';
import { revalidatePath } from 'next/cache';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  if (parseInt(params.id) > 60) {
    revalidatePath(`/isr/${params.id}`);
    return <h1>Should not be cached Ever!!!</h1>;
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    { next: { tags: ['collection'] }, cache: 'force-cache' },
  );

  const currentTime = await getISODateServerAction();

  const data = (await res.json()) as { title: string; body: string };

  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {`[${params.id}] ${data.title}`}
        </h1>
        <p className="font-medium text-gray-500">{data.body}</p>
        <p className="font-medium text-amber-200">
          Snapshot Date: {currentTime}
        </p>
      </div>
      <div className="-order-1 col-span-full lg:order-none lg:col-span-2">
        <RenderingInfo type="isr" />
      </div>
    </div>
  );
}
