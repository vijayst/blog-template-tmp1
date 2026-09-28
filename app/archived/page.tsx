import type { Metadata } from "next";
import { getBlog } from "@/lib/utils";
import { SectionPage } from "@/components/SectionPage";

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  return {
    title: blog?.blogName ? `Archived | ${blog.blogName}` : "Archived",
  };
}

export default async function ArchivedPage() {
  const blog = await getBlog();
  const posts =
    blog?.posts?.filter(
      (post: { type?: string }) => post.type === "ar",
    ) ?? [];
  return (
    <SectionPage blogName={blog?.blogName ?? ""} title="Archived" posts={posts} />
  );
}