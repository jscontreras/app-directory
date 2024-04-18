'use client';
import { revalidateTagCahe } from '#/lib/actions';
import { useState } from 'react';

export const RevalidateTagButton = ({
  tag,
  copy,
}: {
  tag: string;
  copy: string;
}) => {
  const [active, setActive] = useState(true);

  async function btnClickHandler() {
    if (!active) {
      return;
    }
    setActive(false);
    await revalidateTagCahe(tag);
    alert(`Revalidated (${tag})`);
    //location.reload();
  }
  return (
    <button
      disabled={!active}
      className={`${
        active ? 'bg-vercel-blue' : 'bg-vercel-violet'
      } rounded-lg px-3 py-1 text-sm font-medium text-white`}
      onClick={btnClickHandler}
    >
      {copy}
    </button>
  );
};
