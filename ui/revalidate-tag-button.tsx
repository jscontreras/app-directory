'use client';
import { revalidateTagCahe } from '#/lib/actions';

export const RevalidateTagButton = ({
  tag,
  copy,
}: {
  tag: string;
  copy: string;
}) => {
  async function btnClickHandler() {
    await revalidateTagCahe(tag);
    alert(`Revalidated (${tag})`);
    location.reload();
  }
  return (
    <button
      className="bg-vercel-blue rounded-lg px-3 py-1 text-sm font-medium text-white"
      onClick={btnClickHandler}
    >
      {copy}
    </button>
  );
};
