import { MetadataRoute } from 'next';
import { getBlog } from '@/lib/utils';

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const blog = await getBlog();
    
    if (!blog || !blog.customDomain || !blog.posts) {
      console.warn('Blog data not available for sitemap generation');
      return [];
    }
    
    const baseUrl = blog.customDomain;
    
    // Get all unique URLs (including redirects)
    const posts: MetadataRoute.Sitemap = blog.posts.flatMap((post: { slug: string; redirects?: string[]; lastModified?: string }) => {
      const urls = [];
      
      // Main post URL
      urls.push({
        url: `${baseUrl}/${post.slug}/`,
        lastModified: post.lastModified ? new Date(post.lastModified) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      
      return urls;
    });
    
    // Add the homepage
    return [
      {
        url: `${baseUrl}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...posts,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [];
  }
}