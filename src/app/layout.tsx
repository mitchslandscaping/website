import { isOwner } from '@/lib/owner/auth';
import { draftMode } from "next/headers";
import EditorPreview from "@/components/editor-preview";
import WebsiteContentProvider from "@/components/website-content";
import { getWebsiteContent } from "@/sanity/content";
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
  robots: { index: false, follow: false }, // Prototype only. Enable indexing after launch approval.
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
      <body><WebsiteContentProvider content={content}><QuoteProvider>{preview && <EditorPreview owner={owner} />}{children}</QuoteProvider></WebsiteContentProvider></body>
    </html>
  );
}
