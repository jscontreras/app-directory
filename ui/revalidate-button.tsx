'use client';
import { revalidatePathCahe } from '#/lib/actions';

export const RevalidateButton = ({
  path,
  copy,
}: {
  path: string;
  copy: string;
}) => {
  function btnClickHandler() {
    revalidatePathCahe(path);
    alert(`Revalidated (${path})`);
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
