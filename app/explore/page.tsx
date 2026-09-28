import type { Metadata } from "next";
import { getBlog } from "@/lib/utils";
import { SectionPage } from "@/components/SectionPage";

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  return {
    title: blog?.blogName ? `Explorations | ${blog.blogName}` : "Explorations",
  };
}

export default async function ExplorePage() {
  const blog = await getBlog();
  const posts =
    blog?.posts?.filter(
      (post: { type?: string }) => !post.type || post.type === "ex",
    ) ?? [];
  return (
    <SectionPage blogName={blog?.blogName ?? ""} title="Explorations" posts={posts} />
  );
}