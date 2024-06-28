'use server';

export async function getServerComponentData(label: string) {
  const versionWithV = process.version;
  return {
    nodeVersion: `Node Version: ${versionWithV}`,
    label: `Server :: ${label}`,
  };
}
