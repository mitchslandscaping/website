"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Dialog from "./dialog";
import { ArrowUpRight } from "lucide-react";

const quoteFormUrl = "https://forms.fillout.com/t/npD75Ti9yHus";

const QuoteContext = createContext<{ openQuote: (service?: string) => void } | null>(null);
export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error("QuoteProvider is required");
  return context;
}

export default function QuoteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const openQuote = useCallback((service?: string) => {
    if (service) {
      setSelected(previous => previous.includes(service) ? previous : [...previous.filter(item => item !== "Not sure yet"), service]);

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
  const formUrl = new URL(quoteFormUrl);
  if (selected.length) formUrl.searchParams.set("service", selected.join("; "));
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
    <Dialog title="Request a free quote" open={open} onClose={() => setOpen(false)} className="quote-dialog quote-fillout-dialog">
      <div className="quote-fillout-toolbar"><a href={formUrl.toString()} target="_blank" rel="noopener noreferrer">Open form in a new tab <ArrowUpRight size={14} aria-hidden="true" /></a></div>
      {(open || loaded) && <iframe src={formUrl.toString()} title="Request a free estimate from Mitch’s Landscaping" className="quote-fillout-frame" onLoad={() => setLoaded(true)} />}
    </Dialog>
  </QuoteContext.Provider>;
}
