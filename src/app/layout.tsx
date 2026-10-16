import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/manrope";
import "@/styles/globals.css";
import { profile } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: `${profile.name} — Full Stack Developer`,
  description:
    "A sample creative developer portfolio exploring thoughtful interfaces, full stack development, and purposeful motion.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — Thoughtfully Built`,
    description: profile.shortIntro,
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Full Stack Developer`,
    description: profile.shortIntro,
    images: ["/opengraph-image"],
  },
  robots: { index: !profile.isDemo, follow: !profile.isDemo },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d5cfbe",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.hash&&performance.getEntriesByType('navigation')[0]?.type!=='back_forward'){document.documentElement.dataset.intro='pending';setTimeout(()=>{if(document.documentElement.dataset.intro==='pending')delete document.documentElement.dataset.intro},6000)}}catch{}`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
