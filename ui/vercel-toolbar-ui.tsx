'use client';
import { VercelToolbar } from '@vercel/toolbar/next';

export function VercelToolbarUI() {
  const isEmployee = true;
  return isEmployee ? <VercelToolbar /> : null;
}
