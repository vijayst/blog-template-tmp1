const pat = process.env.CHATBLOGR_PAT as string;

export async function getBlog() {
  const res = await fetch("https://chatblogr.com/api/bypass/blog", {
    headers: {
      Authorization: `Bearer ${pat}`,
    },
  });
  return res.json();
}

export async function getPost(id: string) {
  const res = await fetch(`https://chatblogr.com/api/bypass/blog/${id}`, {
    headers: {
      Authorization: `Bearer ${pat}`,
    },
  });
  return res.json();
}