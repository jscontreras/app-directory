'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { draftMode } from 'next/headers';
import { getDiskInfo } from 'node-disk-info';

export async function getCurrentHourInCityServerAction(timezone: string) {
  console.log('timezone', timezone);
  const res = await fetch(
    `https://worldtimeapi.org/api/ip`,
    // { next: { revalidate: 300, tags: ['timezone'] },
    { cache: 'force-cache' },
  );
  const data = (await res.json()) as { datetime: string };

  const currentTime = new Date(data.datetime).toLocaleString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
  });
  return currentTime;
}

export async function revalidatePathCahe(path: string) {
  await revalidatePath(path);
}

export async function revalidateTagCahe(tag: string) {
  await revalidateTag(tag);
}

export async function isPreviewModeEnabled() {
  const { isEnabled } = draftMode();
  return isEnabled;
}

export async function switchDraftMode(active: boolean) {
  if (active) {
    draftMode().enable();
  } else {
    draftMode().disable();
  }
}

export async function printDiskSize() {
  try {
    const disks = await getDiskInfo();
    const currentDisk = disks.find((disk) => disk.mounted === '/'); // Assuming the script is running from the root directory

    if (currentDisk) {
      console.log(`>>>>>>>>>>Filesystem: ${currentDisk.filesystem}`);
      console.log(`>>>>>>>>>>Total Size: ${currentDisk.blocks} bytes`);
      console.log(`>>>>>>>>>>Used: ${currentDisk.used} bytes`);
      console.log(`>>>>>>>>>>Available: ${currentDisk.available} bytes`);
      console.log(`>>>>>>>>>>Capacity: ${currentDisk.capacity}`);
      console.log(`>>>>>>>>>>Mounted: ${currentDisk.mounted}`);
    } else {
      console.log(
        'Could not determine the disk where the script is running from.',
      );
    }
  } catch (error) {
    console.error('Error retrieving disk information:', error);
  }
}
