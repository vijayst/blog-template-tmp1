import type { Metadata } from "next";
import { BlogPage } from "@/components/BlogPage";
import { getBlog } from "@/lib/utils";



export async function generateMetadata(): Promise<Metadata> {
  try {
    const blog = await getBlog();
    
    if (!blog) {
      console.warn('Blog data not available for metadata generation');
      return {};
    }
    
    const title = blog.blogName;
    const description = blog.description;
    const customDomain = blog.customDomain;

    return title
      ? {
          title,
          description,
          alternates: {
            canonical: customDomain,
          },
          openGraph: {
            title,
            description,
            url: customDomain,
            type: "article",
            images: `${customDomain}/images/facebook.png`,
          },
          twitter: {
            card: "summary",
            images: `${customDomain}/images/twitter.png`,
          },
        }
      : {};
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {};
  }
}

export default async function Page() {
  const blog = await getBlog();
  
  if (!blog || !blog.posts) {
    console.error('Blog data not available for homepage');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to load blog
          </h1>
          <p className="text-gray-600">
            Please try again later
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <BlogPage
      posts={blog.posts}
      blogName={blog.blogName}
    />
  );
}
