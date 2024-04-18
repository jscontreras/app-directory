'use client';
import { revalidatePathCahe } from '#/lib/actions';
import { useState } from 'react';

export const RevalidateButton = ({
  path,
  copy,
}: {
  path: string;
  copy: string;
}) => {
  const [active, setActive] = useState(true);
  async function btnClickHandler() {
    if (!active) {
      return;
    }
    setActive(false);
    await revalidatePathCahe(path);
    alert(`Revalidated (${path})`);
    location.reload();
  }
  return (
    <button
      className={`${
        active ? 'bg-vercel-blue' : 'bg-vercel-violet'
      } rounded-lg px-3 py-1 text-sm font-medium text-white`}
      onClick={btnClickHandler}
    >
      {copy}
    </button>
  );
};
