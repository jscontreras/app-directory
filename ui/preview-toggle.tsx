/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ogUFC5zUUCM
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client';

import { isPreviewModeEnabled, switchDraftMode } from '#/lib/actions';
import { useEffect, useState } from 'react';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();

  const [isPreviewMode, setIsPreviewMode] = useState({
    enabled: false,
    loaded: false,
  });
  const handleToggle = async () => {
    const newState = !isPreviewMode.enabled;
    await switchDraftMode(newState);
    setIsPreviewMode({ ...isPreviewMode, enabled: newState });
    router.refresh();
  };
  useEffect(() => {
    (async () => {
      if (!isPreviewMode.loaded) {
        const active = await isPreviewModeEnabled();
        setIsPreviewMode({ enabled: active, loaded: true });
      }
    })();
  }, [isPreviewMode]);

  return (
    <div className="flex items-center gap-2 pb-4">
      <Label htmlFor="preview-mode">Draft Mode</Label>
      {isPreviewMode.loaded && (
        <Switch
          id="preview-mode"
          checked={isPreviewMode.enabled}
          onCheckedChange={handleToggle}
        />
      )}
      {!isPreviewMode.loaded && <p className="text-gray-500">loading...</p>}
    </div>
  );
}
