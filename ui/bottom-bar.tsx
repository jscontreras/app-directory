'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TimedCampaignBarProps {
  message: string;
  color?: string;
}

export default function BottomBar({ message, color }: TimedCampaignBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const defColor = color ? color : 'bg-rose-300';
  if (!isVisible) return null;
  return (
    <div
      className={`bg-primary text-gray-1000 fixed bottom-0 left-0 flex w-screen items-center justify-between ${defColor} px-4 py-2 text-sm`}
    >
      <div className="flex-1 text-center">{message}</div>
      <button
        onClick={() => setIsVisible(false)}
        className="hover:bg-primary-foreground hover:text-primary ml-4 rounded-full p-1 transition-colors"
        aria-label="Close campaign bar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
