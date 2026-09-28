import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MAX_REQUESTS_PER_DAY = 10;

// Get the bypass API URL from environment variables
const BYPASS_API_BASE_URL = process.env.BYPASS_API_BASE_URL || "https://chatblogr.com";

// Get the bypass API authorization token
const BYPASS_API_TOKEN = process.env.CHATBLOGR_PAT;

// Rate limiting using httpOnly cookies
async function checkRateLimit(blogSlug: string): Promise<boolean> {
  const cookieStore = await cookies();
  const rateLimitCookie = cookieStore.get(`comment_rate_limit_${blogSlug}`);

  if (!rateLimitCookie) {
    // First request, set the cookie
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    cookieStore.set(`comment_rate_limit_${blogSlug}`, "1", {
      httpOnly: true,
      expires,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return true;
  }

  const currentCount = parseInt(rateLimitCookie.value, 10);
  if (currentCount >= MAX_REQUESTS_PER_DAY) {
    return false;
  }

  // Increment the count
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);

  cookieStore.set(`comment_rate_limit_${blogSlug}`, (currentCount + 1).toString(), {
    httpOnly: true,
    expires,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return true;
}

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

    if (!slug) {
      return NextResponse.json(
        { error: "Blog post slug is required" },
        { status: 400 },
      );
    }

    // Check rate limit
    const isAllowed = await checkRateLimit(slug);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 10 requests per day." },
        { status: 429 },
      );
    }

    // Check if bypass API token is configured
    if (!BYPASS_API_TOKEN) {
      console.error('CHATBLOGR_PAT is not configured');
      return NextResponse.json(
        { error: "Bypass API token not configured" },
        { status: 500 },
      );
    }

    // Call the bypass API to fetch comments
    const bypassApiUrl = `${BYPASS_API_BASE_URL}/api/bypass/blog/${slug}/comments`;
    
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
        { error: errorData.error || "Failed to fetch comments" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const { text, commenterName, recaptchaToken, parentCommentId } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 },
      );
    }

    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA token is required" },
        { status: 400 },
      );
    }

    // Check rate limit
    const isAllowed = await checkRateLimit(slug);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 10 requests per day." },
        { status: 429 },
      );
    }

    // Check if bypass API token is configured
    if (!BYPASS_API_TOKEN) {
      return NextResponse.json(
        { error: "Bypass API token not configured" },
        { status: 500 },
      );
    }

    // Call the bypass API to create the comment
    const bypassApiUrl = `${BYPASS_API_BASE_URL}/api/bypass/blog/${slug}/comments`;
    
    const requestBody = {
      text,
      commenterName,
      recaptchaToken,
      parentCommentId,
    };
    
    const response = await fetch(bypassApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BYPASS_API_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to create comment" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}