'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { defaultContent, type WebsiteContent } from '@/lib/website-defaults';
const WebsiteContext = createContext<WebsiteContent>(defaultContent);
export const useWebsiteContent = () => useContext(WebsiteContext);
export default function WebsiteContentProvider({ content, children }: { content: WebsiteContent; children: ReactNode }) {
  return <WebsiteContext.Provider value={content}>{children}</WebsiteContext.Provider>;
}
