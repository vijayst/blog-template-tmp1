import Link from "next/link";
import { BlogPost } from "@/types";
import { md } from "@/components/md";
import { Button } from "@/components/Button";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/${post.slug}`} className="block h-full">
      <div className="h-full flex flex-col border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 bg-white">
        <h2 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
          {post.title}
        </h2>
        <div className="text-gray-600 text-sm flex-1 overflow-hidden">
          <div
            className="message p-0 m-0"
            style={{ maxWidth: "none", margin: 0 }}
            dangerouslySetInnerHTML={{
              __html: md.render(post.description ?? ""),
            }}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button size="1">Read More &gt;</Button>
        </div>
      </div>
    </Link>
  );
}