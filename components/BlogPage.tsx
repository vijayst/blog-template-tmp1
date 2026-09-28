"use client";
import { Layout } from "@/components/Layout";
import { PostSection } from "@/components/PostSection";
import { BlogPost } from "@/types";

export function BlogPage({
  blogName,
  posts,
}: {
  posts: BlogPost[];
  blogName: string;
}) {
  const kbPosts = posts.filter((post) => post.type === "kb");
  const exPosts = posts.filter((post) => !post.type || post.type === "ex");

  return (
    <Layout blogName={blogName}>
      <div className="w-full max-w-[768px] mx-auto flex flex-col gap-8 pb-4 px-6">
        <PostSection title="Knowledge Base" posts={kbPosts} viewMoreHref="/kb" />
        <PostSection title="Explorations" posts={exPosts} viewMoreHref="/explore" />
      </div>
    </Layout>
  );
}