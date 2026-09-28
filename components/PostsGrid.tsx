import Link from "next/link";
import { PostCard } from "@/components/PostCard";
import { BlogPost } from "@/types";

const MAX_CARDS = 6;

export function PostsGrid({
  posts,
  viewMoreHref,
}: {
  posts: BlogPost[];
  viewMoreHref?: string;
}) {
  const hasMore = viewMoreHref && posts.length > MAX_CARDS;

  const visiblePosts = hasMore ? posts.slice(0, MAX_CARDS - 1) : posts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {visiblePosts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      {hasMore && (
        <Link href={viewMoreHref} className="block h-full">
          <div className="h-full flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors p-5">
            <span className="text-lg font-semibold text-gray-700">
              View More
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}