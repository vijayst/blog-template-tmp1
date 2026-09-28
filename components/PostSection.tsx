import { PostsGrid } from "@/components/PostsGrid";
import { BlogPost } from "@/types";

export function PostSection({
  title,
  posts,
  viewMoreHref,
}: {
  title: string;
  posts: BlogPost[];
  viewMoreHref: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="pt-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <PostsGrid posts={posts} viewMoreHref={viewMoreHref} />
    </section>
  );
}