'use client';
import { VercelToolbar } from '@vercel/toolbar/next';
import { useEffect, useState } from 'react';

export function VercelToolbarUI() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // Check if Ctrl key is pressed along with 'K'
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault(); // Prevent the default action of Ctrl+K
        setIsVisible(!isVisible); // Toggle visibility
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  return isVisible ? <VercelToolbar /> : null;
}
