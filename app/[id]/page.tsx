import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PostPage } from "@/components/PostPage";
import { ArchivedPostPage } from "@/components/ArchivedPostPage";
import { getBlog, getPost } from "@/lib/utils";

type Props = Promise<{
  id: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: Props;
}): Promise<Metadata> {
  const id = (await params).id;
  const post = await getPost(id);
  if (post.redirect) {
    return {};
  }
  const title = post.title;
  const description = post.messages?.[0]?.content || post.title;
  const customDomain = post.customDomain;

  return title
    ? {
        title,
        description,
        alternates: {
          canonical: `${customDomain}/${id}`,
        },
        openGraph: {
          title,
          description,
          url: `${customDomain}/${id}`,
          type: "article",
          images: `${customDomain}/images/facebook.png`,
        },
        twitter: {
          card: "summary",
          title,
          description,
          images: `${customDomain}/images/twitter.png`,
        },
      }
    : {};
}

export default async function Page({ params }: { params: Props }) {
  const id = (await params).id;
  const blog = await getBlog();
  const postType = blog?.posts?.find(
    (p: { slug: string; type?: string }) => p.slug === id
  )?.type;

  if (postType === "ar") {
    return <ArchivedPostPage id={id} />;
  }

  const post = await getPost(id);
  if (post.redirect) {
    redirect("/" + post.redirect);
  }
  return <PostPage {...post} />;
}
