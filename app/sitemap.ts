import { demos } from '#/lib/demos';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const root = `https://www.tc-vercel.dev/`;
  let priority: number = 1.0;
  const samples = [
    {
      url: root,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: priority,
    },
    {
      url: `${root}/pocs/images`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: priority,
    },
  ];

  const entries: any[] = [...samples];
  demos.forEach((section) => {
    priority = parseFloat((priority - 0.1).toFixed(1));
    section.items.forEach((item) => {
      entries.push({
        url: `${root}${item.slug}/`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: priority,
      });
    });
  });

  return entries;
}
