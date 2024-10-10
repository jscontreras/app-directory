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

export const featureFlags = [showBottomBar] as const;
