"use client";

import { useEffect, useState } from "react";
import { PostPage } from "@/components/PostPage";

export function ArchivedPostPage({ id }: { id: string }) {
  const [post, setPost] = useState<{
    blogName: string;
    content: string;
    description?: string;
    title: string;
    createdAt?: number | string | { _seconds: number; _nanoseconds: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
      })
      .then((data) => setPost(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return <div className="max-w-[768px] w-full mx-auto p-8 text-center">Failed to load post.</div>;
  }

  if (!post) {
    return <div className="max-w-[768px] w-full mx-auto p-8 text-center">Loading...</div>;
  }

  return <PostPage {...post} />;
}
