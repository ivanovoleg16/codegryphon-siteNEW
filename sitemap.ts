import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://codegryphon.ai';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/ru`, lastModified: new Date() },
  ];
}
