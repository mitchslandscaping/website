import { isOwner } from '@/lib/owner/auth';
import { draftMode } from "next/headers";
import EditorPreview from "@/components/editor-preview";
import WebsiteContentProvider from "@/components/website-content";
import { getWebsiteContent } from "@/lib/website-content";
import QuoteProvider from "@/components/quote-provider";
import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource/plus-jakarta-sans/latin-500.css";
import "@fontsource/plus-jakarta-sans/latin-600.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "@fontsource/plus-jakarta-sans/latin-800.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "./globals.css";
import "./reference-direction.css";
import "./hero.css";
import "./trusted-by.css";
import "./company.css";
import "./quote.css";

export const metadata: Metadata = {
  title: "Mitch’s Landscaping | Landscape, Build & Maintain",
  description:
    "Residential and commercial landscaping, lawn care, hardscaping, fencing, and drainage. Start your next outdoor project with a free estimate.",
  metadataBase: new URL("https://www.mitchlandscaping.com"),
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#171d20" };
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getWebsiteContent();
  const preview = (await draftMode()).isEnabled;
  const owner = preview && await isOwner();
  return (
    <html lang="en">
      <head><script dangerouslySetInnerHTML={{__html: `
        (() => {
          if (location.pathname.startsWith('/owner')) return;
          const navigation = performance.getEntriesByType('navigation')[0];
          if (!navigation || navigation.type !== 'reload') return;
          history.scrollRestoration = 'manual';
          if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
          const top = () => window.scrollTo({top: 0, left: 0, behavior: 'instant'});
          top();
          window.addEventListener('pageshow', () => { top(); requestAnimationFrame(top); }, {once: true});
        })();
      `}} /></head>
      <body><WebsiteContentProvider content={content}><QuoteProvider>{preview && <EditorPreview owner={owner} />}{children}</QuoteProvider></WebsiteContentProvider></body>
    </html>
  );
}
