import { Layout } from "@/components/Layout";
import { PostsGrid } from "@/components/PostsGrid";
import { BlogPost } from "@/types";

export function SectionPage({
  blogName,
  title,
  posts,
}: {
  blogName: string;
  title: string;
  posts: BlogPost[];
}) {
  return (
    <Layout blogName={blogName}>
      <div className="w-full max-w-[768px] mx-auto pb-4 px-6">
        <h1 className="text-3xl font-bold text-gray-900 pt-6 mb-6">{title}</h1>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts available.</p>
        ) : (
          <PostsGrid posts={posts} />
        )}
      </div>
    </Layout>
  );
}