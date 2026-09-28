declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: any) => Promise<string>;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    particlesJS: {
      load: (id: string, path: string, callback?: () => void) => void;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type SiteVerifyRequest = {
  secret: string;
  response: string;
}

export type SiteVerifyResponse = {
  success: boolean;
  "error-codes": string[];
  challenge_ts: string;
  hostname: string;
}

export type Chat = {
  userId: string;
  title: string;
  chatId: string;
  createdTime?: number;
  updatedTime?: number;
  messages: Message[]
  visibility?: boolean;
}

export type Blog = {
  blogHandle: string;
  blogName: string;
  defaultVisibility?: boolean;
  analyticsId?: string;
  adsenseId?: string;
  customDomain?: string;
}

export type BlogPost = {
  chatId: string;
  title: string;
  description: string;
  updatedTime?: number;
  slug: string;
  type?: "kb" | "ex" | "ar";
  redirects?: string[];
}

export type Comment = {
  id: string;
  text: string;
  timestamp: Date;
  commenterName?: string;
  fromAdmin?: boolean;
  editedByAdmin?: boolean;
  replies?: Comment[];
}