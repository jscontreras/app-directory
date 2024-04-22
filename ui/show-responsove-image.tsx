'use client';
import { EyeIcon } from 'lucide-react';

export const ShowResponsiveImages = () => {
  return (
    <button
      onClick={() => {
        document
          .getElementsByClassName('responsive-images')[0]
          .classList.remove('responsive-images');
      }}
      className="inline-flex gap-x-2 rounded-lg bg-gray-700 px-3 py-1 text-sm font-medium text-gray-100 no-underline hover:bg-gray-500 hover:text-white"
    >
      <div>Show Hidden Images</div>
      <EyeIcon className="block w-4" />
    </button>
  );
};
