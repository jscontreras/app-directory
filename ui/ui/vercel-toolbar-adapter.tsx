'use client';
import { mountVercelToolbar, unmountVercelToolbar } from '@vercel/toolbar';
export default function VercelToolbarAdapter() {
  if (typeof window !== 'undefined') {
    (window as any).unmountVercelToolbar = unmountVercelToolbar;
    (window as any).mountVercelToolbar = mountVercelToolbar;
  }
  return null;
}
