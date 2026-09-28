import type { Metadata } from "next";
import { getBlog } from "@/lib/utils";
import { SectionPage } from "@/components/SectionPage";

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  return {
    title: blog?.blogName ? `Knowledge Base | ${blog.blogName}` : "Knowledge Base",
  };
}

export default async function KBPage() {
  const blog = await getBlog();
  const posts =
    blog?.posts?.filter(
      (post: { type?: string }) => post.type === "kb",
    ) ?? [];
  return (
    <SectionPage blogName={blog?.blogName ?? ""} title="Knowledge Base" posts={posts} />
  );
}