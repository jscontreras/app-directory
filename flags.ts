import { unstable_flag as flag } from '@vercel/flags/next';
import { get } from '@vercel/edge-config';

export const showBottomBar = flag({
  key: 'bottomBar',
  options: [
    { value: false, label: 'Hide Bar' },
    { value: true, label: 'Show Bar' } as any,
  ],
  async decide() {
    // you can use headers() and cookies() as well!
    const { bottomBar } = (await get('flags')) as any;
    const { threshold } = bottomBar;
    return Math.random() <= threshold;
  },
});

export const barColor = flag({
  key: 'barColor',
  options: [
    { value: 'bg-pink-200', label: 'Pink' },
    { value: 'bg-amber-200', label: 'Yellow' },
    { value: 'bg-sky-200', label: 'Blue' } as any,
  ],
  async decide() {
    // you can use headers() and cookies() as well!
    const { bottomBar } = (await get('flags')) as any;
    const { barColor } = bottomBar;
    return barColor || 'bg-pink-200';
  },
});

export const featureFlags = [showBottomBar, barColor] as const;
