import { NextResponse } from "next/server";

const BYPASS_API_BASE_URL = process.env.BYPASS_API_BASE_URL || "https://chatblogr.com";
const BYPASS_API_TOKEN = process.env.CHATBLOGR_PAT;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Blog post slug is required" },
        { status: 400 },
      );
    }

    if (!BYPASS_API_TOKEN) {
      console.error('CHATBLOGR_PAT is not configured');
      return NextResponse.json(
        { error: "Bypass API token not configured" },
        { status: 500 },
      );
    }

    const bypassApiUrl = `${BYPASS_API_BASE_URL}/api/bypass/blog/${slug}`;
    
    const response = await fetch(bypassApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BYPASS_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch blog post" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 },
    );
  }
}