import { unstable_flag as flag } from '@vercel/flags/next';
import { get } from '@vercel/edge-config';
import { headers } from 'next/headers';

export const showBottomBar = flag({
  key: 'bottomBar',
  options: [
    { value: false, label: 'Hide Bar' },
    { value: true, label: 'Show Bar' } as any,
  ],
  async decide() {
    // you can use headers() and cookies() as well!
    const headersList = await headers();
    const pathname = (await headersList.get('x-pathname')) || '';
    // The flag is automatically activated based on path
    if (['blue', 'pink', 'yellow'].some((color) => pathname.includes(color))) {
      return true;
    }
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
    const headersList = headers() as unknown as UnsafeUnwrappedHeaders;
    // headersList.forEach((value, key) => {
    //   console.log('>>>>>>>>>>>>>', key, value);
    // });
    const pathname = headersList.get('x-pathname') || '';
    // selecting color based on path
    if (pathname.includes('blue')) {
      return 'bg-sky-200';
    } else if (pathname.includes('pink')) {
      return 'bg-pink-200';
    } else if (pathname.includes('yellow')) {
      return 'bg-amber-200';
    }

    const { bottomBar } = (await get('flags')) as any;
    const { barColor } = bottomBar;
    return barColor || 'bg-pink-200';
  },
});

export const featureFlags = [showBottomBar, barColor] as const;
