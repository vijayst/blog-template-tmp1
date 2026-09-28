import { MetadataRoute } from 'next';
import { getBlog } from '@/lib/utils';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const blog = await getBlog();
  const baseUrl = blog.customDomain;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}