import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Theme } from "@radix-ui/themes";
import Script from "next/script";
import { Inter } from "next/font/google";
import { getBlog } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import { RecaptchaScript } from "@/components/RecaptchaScript";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { adsenseId } = await getBlog();
  
  return {
    other: adsenseId ? {
      "google-adsense-account": adsenseId,
    } : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { analyticsId, adsenseId } = await getBlog();
  
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <RecaptchaScript />
        {analyticsId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${analyticsId}');
              `}
            </Script>
          </>
        )}
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
