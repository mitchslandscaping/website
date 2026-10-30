"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useWebsiteContent } from "./website-content";

export default function ServicesMenu({ home = false }: { home?: boolean }) {
  const { serviceGroups } = useWebsiteContent();
  const ref = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div className="services-menu" ref={ref} onPointerEnter={event => { if (event.pointerType === "mouse") setOpen(true); }} onPointerLeave={event => { if (event.pointerType === "mouse") setOpen(false); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <div className="services-menu-trigger">
        <a href={home ? "#services" : "/#services"} onClick={() => setOpen(false)}>Services</a>
        <button ref={toggle} type="button" aria-label="Show service divisions" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen(value => !value)}><ChevronDown size={15} aria-hidden="true" /></button>
      </div>
      <div className="services-menu-links" id={menuId} hidden={!open}>
        {serviceGroups.map((group) => <a key={group.id} href={`/services/${group.slug}`} onClick={() => setOpen(false)}>{group.title}</a>)}
      </div>
    </div>
  );
}
