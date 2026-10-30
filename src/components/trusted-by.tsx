"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Building2, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

export type CustomerLogo = {
  id: string; name: string; image: string; lightBackground?: boolean; lightMark?: boolean; clipPath?: string;
  crop?: { x: number; y: number; width: number; height: number; sourceWidth: number; sourceHeight: number };
};
export type TrustedByContent = { enabled: boolean; heading: string; logos: CustomerLogo[] };
const storageKey = "mitchs-trusted-by-preview-v1";
const imagePattern = /^(data:image\/(png|jpeg|webp|svg\+xml);base64,|\/images\/)/;

export function useTrustedBy(initial: TrustedByContent) {
  const [content, setContent] = useState(initial);
  useEffect(() => {
    setContent(initial);
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && typeof saved.enabled === "boolean" && typeof saved.heading === "string" && saved.heading.trim() && saved.heading.length <= 120 && Array.isArray(saved.logos) && saved.logos.length <= 24 && saved.logos.every((logo: CustomerLogo) => typeof logo.id === "string" && typeof logo.name === "string" && typeof logo.image === "string" && (!logo.image || imagePattern.test(logo.image)))) {
        setContent(saved);
      }
    } catch { /* A blocked or invalid local draft leaves the default preview intact. */ }
  }, [initial]);
  function save(next: TrustedByContent) {
    localStorage.setItem(storageKey, JSON.stringify(next));
    setContent(next);
  }
  function reset() {
    localStorage.removeItem(storageKey);
    setContent(initial);
  }
  return { content, save, reset };
}

export default function TrustedBy({ content }: { content: TrustedByContent }) {
  if (!content.enabled) return null;
  const placeholder = content.logos.length === 0;
  const logos: CustomerLogo[] = placeholder
    ? Array.from({ length: 6 }, (_, i) => ({ id: String(i), name: `Customer logo ${String(i + 1).padStart(2, "0")}`, image: "" }))
    : content.logos;
  const repeatedLogos = Array.from({ length: Math.max(1, Math.ceil(16 / logos.length)) }, () => logos).flat();
  return (
    <section className="trusted-by" aria-labelledby="trusted-heading">
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <defs>
          <filter id="autozone-wordmark" colorInterpolationFilters="sRGB">
            {/* Keep the red/orange artwork; discard the black shadow and white background. */}
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 -1 0 0" />
          </filter>
        </defs>
      </svg>
      <h2 id="trusted-heading">{content.heading}</h2>
      <div className="trusted-window" role="region" aria-label="Customer logos">
        <div className="trusted-track" style={{ animationDuration: `${Math.max(28, repeatedLogos.length * 5)}s` }}>
          {[false, true].map((duplicate) => (
            <ul className="trusted-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {repeatedLogos.map((logo, index) => (
                <li className={`trusted-logo trusted-logo-${logo.id}${logo.lightBackground ? " trusted-logo-light" : ""}${logo.lightMark ? " trusted-logo-light-mark" : ""}`} key={`${logo.id}-${index}`} aria-hidden={index >= logos.length || undefined}>
                  {logo.image ? (
                    // Local preview uploads can be SVGs or data URLs; preserve original proportions.
                    // eslint-disable-next-line @next/next/no-img-element
                    <span className="trusted-logo-art" style={logo.crop ? { aspectRatio: `${logo.crop.width} / ${logo.crop.height}`, width: `min(calc(var(--trusted-logo-height) * ${logo.crop.width / logo.crop.height}), var(--trusted-logo-max-width))`, height: "auto", clipPath: logo.clipPath } : undefined}>
                      <img src={logo.image} alt={duplicate || index >= logos.length ? "" : logo.name} style={logo.crop ? {
                        position: "absolute", maxWidth: "none", height: "auto",
                        width: `${logo.crop.sourceWidth / logo.crop.width * 100}%`,
                        left: `${-logo.crop.x / logo.crop.width * 100}%`,
                        top: `${-logo.crop.y / logo.crop.height * 100}%`,
                      } : undefined} />
                    </span>
                  ) : (
                    <span className={placeholder ? "trusted-placeholder" : "trusted-wordmark"}>
                      {placeholder && <Building2 size={27} strokeWidth={1.3} aria-hidden="true" />}
                      {logo.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustedByEditor({ content, onSave, onReset }: { content: TrustedByContent; onSave: (value: TrustedByContent) => void; onReset: () => void }) {
  const [draft, setDraft] = useState(() => ({ ...content, logos: content.logos.map(logo => ({ ...logo })) }));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  function update(id: string, values: Partial<CustomerLogo>) {
    setDraft(current => ({ ...current, logos: current.logos.map(logo => logo.id === id ? { ...logo, ...values } : logo) }));
  }
  function reorder(index: number, direction: number) {
    setDraft(current => {
      const logos = [...current.logos];
      [logos[index], logos[index + direction]] = [logos[index + direction], logos[index]];
      return { ...current, logos };
    });
  }
  async function upload(id: string, file: File | undefined) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type) || file.size > 250 * 1024) {
      setError("Choose a PNG, JPG, WebP, or SVG logo under 250 KB for this browser preview.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read"));
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("image"));
        img.src = image;
      });
      update(id, { image, crop: undefined, clipPath: undefined, lightMark: false });
    } catch { setError("That logo could not be opened. Try a different image file."); }
    finally { setLoading(false); }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.heading.trim() || draft.logos.some(logo => !logo.name.trim())) {
      setError("Add a heading and a customer name for each logo.");
      return;
    }
    try { onSave({ ...draft, heading: draft.heading.trim(), logos: draft.logos.map(logo => ({ ...logo, name: logo.name.trim() })) }); }
    catch { setError("Your browser could not save this draft. Try smaller logos or enable browser storage."); }
  }
  return (
    <form className="trusted-editor" onSubmit={submit}>
      <p className="eyebrow">BROWSER-ONLY EDITING PREVIEW</p>
      <h2>Edit Trusted by</h2>
      <p className="trusted-editor-help">Changes stay in this browser. They do not publish or sync to your phone or other visitors. The authenticated CMS will handle shared edits later.</p>
      <label className="trusted-toggle"><input type="checkbox" checked={draft.enabled} onChange={event => setDraft({ ...draft, enabled: event.target.checked })} /> Show this section</label>
      <label>Section heading<input required maxLength={120} value={draft.heading} onChange={event => setDraft({ ...draft, heading: event.target.value })} /></label>
      <p className="trusted-editor-help">Use your actual customers’ logos. Transparent logos work best. Logos display in grayscale at a consistent height. Up to 24 logos; 250 KB each in this preview.</p>
      <div className="trusted-editor-items">
        {draft.logos.map((logo, index) => (
          <fieldset key={logo.id} className="trusted-editor-item">
            <legend>Customer {index + 1}</legend>
            <label>Customer name<input required maxLength={80} value={logo.name} onChange={event => update(logo.id, { name: event.target.value })} /></label>
            {logo.image && <div className="trusted-editor-image"><img src={logo.image} alt={logo.name || "Selected logo"} /></div>}
            <label>Logo image<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" disabled={loading} onChange={event => void upload(logo.id, event.target.files?.[0])} /></label>
            <label className="trusted-toggle"><input type="checkbox" checked={!!logo.lightBackground} onChange={event => update(logo.id, { lightBackground: event.target.checked })} /> Logo has a white background</label>
            <div className="trusted-editor-tools">
              <button type="button" disabled={index === 0 || loading} aria-label={`Move customer ${index + 1} earlier`} onClick={() => reorder(index, -1)}><ChevronLeft size={16} /> Earlier</button>
              <button type="button" disabled={index === draft.logos.length - 1 || loading} aria-label={`Move customer ${index + 1} later`} onClick={() => reorder(index, 1)}>Later <ChevronRight size={16} /></button>
              <button type="button" disabled={loading} aria-label={`Remove customer ${index + 1}`} onClick={() => setDraft(current => ({ ...current, logos: current.logos.filter(item => item.id !== logo.id) }))}><Trash2 size={15} /> Remove</button>
              {logo.image && <button type="button" onClick={() => update(logo.id, { image: "" })}>Remove image</button>}
            </div>
          </fieldset>
        ))}
      </div>
      <button className="trusted-add" type="button" disabled={draft.logos.length >= 24 || loading} onClick={() => setDraft(current => ({ ...current, logos: [...current.logos, { id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, name: "", image: "" }] }))}><Plus size={18} /> Add customer</button>
      {error && <p role="alert" className="trusted-editor-error">{error}</p>}
      {loading && <p role="status">Reading logo…</p>}
      <div className="trusted-editor-footer">
        <button className="button button-blue" type="submit" disabled={loading}>Save browser preview</button>
        <button className="trusted-reset" type="button" disabled={loading} onClick={() => { try { onReset(); } catch { setError("Your browser could not clear the draft."); } }}>Reset this section</button>
      </div>
    </form>
  );
}
