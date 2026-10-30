"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Dialog from "./dialog";
import QuoteBuilder from "./quote-builder";

const QuoteContext = createContext<{ openQuote: (service?: string) => void } | null>(null);
export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error("QuoteProvider is required");
  return context;
}

export default function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [serviceRequest, setServiceRequest] = useState(0);
  const openQuote = useCallback((service?: string) => {
    if (service) {
      setSelected(previous => previous.includes(service) ? previous : [...previous.filter(item => item !== "Not sure yet"), service]);
      setServiceRequest(previous => previous + 1);
    }
    setOpen(true);
  }, []);
  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash === "#estimate") openQuote(new URLSearchParams(window.location.search).get("service") ?? undefined);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openQuote]);
  return <QuoteContext.Provider value={{ openQuote }}>
    <div onClick={event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.hash === "#estimate") {
        event.preventDefault();
        openQuote(url.searchParams.get("service") ?? undefined);
      }
    }}>{children}</div>
    <Dialog title="Request a free quote" open={open} onClose={() => setOpen(false)} className="quote-dialog">
      <div className="quote-scroll-area"><QuoteBuilder open={open} serviceRequest={serviceRequest} selected={selected} setSelected={setSelected} onClose={() => setOpen(false)} /></div>
    </Dialog>
  </QuoteContext.Provider>;
}
