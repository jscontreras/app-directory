import { unstable_flag as flag } from '@vercel/flags/next';
import { get } from '@vercel/edge-config';

export const showBottomBar = flag({
  key: 'bottom-bar',
  async decide() {
    const { bottomBar } = (await get('flags')) as any; // could use this.key instead
    return bottomBar ?? false;
  },
});
