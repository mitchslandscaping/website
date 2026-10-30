"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  House,
  Building2,
  ImagePlus,
  X,
  LockKeyhole,
  Sprout,
  PencilRuler,
  Hammer,
  Fence,
} from "lucide-react";
import { useWebsiteContent } from "./website-content";

type Photo = { file: File; url: string; id: string };
const stepNames = ["Services", "Your property", "Your details"];

export default function QuoteBuilder({
  open,
  serviceRequest,
  selected,
  setSelected,
  onClose,
}: {
  open: boolean;
  serviceRequest: number;
  selected: string[];
  setSelected: (value: string[]) => void;
  onClose: () => void;
}) {
  const { serviceGroups } = useWebsiteContent();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [draft, setDraft] = useState({
    propertyType: "",
    address: "",
    message: "",
    name: "",
    email: "",
    phone: "",
  });
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [servicesError, setServicesError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const photosRef = useRef<Photo[]>([]);
  useEffect(() => {
    setStep(0);
    setSuccess(false);
    setServicesError(false);
  }, [serviceRequest]);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () =>
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)),
    [],
  );
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      const dialog = heading.current?.closest("dialog");
      if (dialog) dialog.scrollTop = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [step, success, open]);
  function update(name: keyof typeof draft, value: string) {
    setDraft((previous) => ({ ...previous, [name]: value }));
  }
  function addPhotos(files: FileList | null) {
    if (!files) return;
    const additions: Photo[] = [];
    const errors: string[] = [];
    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        errors.push(`${file.name}: use JPG, PNG, or WebP.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: maximum 5 MB.`);
        continue;
      }
      if (
        [...photos, ...additions].some(
          (p) => p.file.name === file.name && p.file.size === file.size,
        )
      )
        continue;
      if (photos.length + additions.length >= 5) {
        errors.push("You can add up to five photos.");
        break;
      }
      additions.push({
        file,
        url: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      });
    }
    setPhotos((previous) => [...previous, ...additions]);
    setPhotoError(errors.join(" "));
    if (input.current) input.current.value = "";
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 0 && !selected.length) {
      setServicesError(true);
      return;
    }
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setSuccess(true);
  }
  const titles = [
    "What can we help you with?",
    "Tell us about your property.",
    "How can we reach you?",
  ];
  return (
    <div className="quote-shell">
      <header className="quote-header">
        <div className="quote-brand"><span className="eyebrow">MITCH’S</span><span>Free estimates · No obligation</span></div>
        <p className="quote-header-title">Let’s talk about your property.</p>
        <ol className="quote-progress" aria-label="Quote progress">
          {stepNames.map((name, i) => (
            <li key={name} className={success || i < step ? "complete" : i === step ? "current" : ""}
              aria-current={!success && i === step ? "step" : undefined}>
              <span>{i < step || success ? <Check size={16} /> : i + 1}</span>
              {name}
            </li>
          ))}
        </ol>
      </header>
      <div className="quote-main">
        {success ? (
          <div className="quote-success" role="status">
            <span className="success-icon">
              <Check size={32} />
            </span>
            <p className="eyebrow">QUOTE PREVIEW COMPLETE</p>
            <h2 ref={heading} tabIndex={-1}>
              Your request is ready to review.
            </h2>
            <p>
              This is how your request will look. Nothing has been sent in this
              prototype.
            </p>
            <div className="quote-summary">
              <strong>Your request</strong>
              <p>{selected.join(" · ")}</p>
              <p>
                {draft.propertyType} · {draft.address}
              </p>
              <p>
                {photos.length} photo{photos.length === 1 ? "" : "s"} attached
              </p>
            </div>
            <p>
              Contact: <strong>{draft.name}</strong> · {draft.email}
              {draft.phone && ` · ${draft.phone}`}
            </p>
            <p>
              {draft.message}
            </p>
            <div className="quote-controls">
              <button
                className="text-link"
                onClick={() => {
                  setSuccess(false);
                  setStep(0);
                }}
              >
                Edit request
              </button>
              <button className="button button-blue" onClick={onClose}>
                Back to the website <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="quote-form">
            <p className="quote-step-label">
              STEP {step + 1} OF 3 <span>Preview · Nothing will be sent</span>
            </p>
            <h2 ref={heading} tabIndex={-1}>
              {titles[step]}
            </h2>
            <p className="quote-description">
              {
                [
                  "Select everything you’re interested in. It’s okay if you’re still figuring things out.",
                  "Tell us where the work is and what you’d like to do. Fields marked * are required.",
                  "Add your contact details, then review your request. Fields marked * are required.",
                ][step]
              }
            </p>
            {step === 0 && (
              <fieldset className="quote-services">
                <legend className="sr-only">Services of interest (required)</legend>
                <div className="quote-division-grid">
                {serviceGroups.map((group, index) => {
                  const Icon = [Sprout, PencilRuler, Hammer, Fence][index];
                  return (
                  <div className="quote-service-group" key={group.id}>
                    <h3><Icon size={22} aria-hidden="true" />{group.title.replace("\n", " ")}</h3>
                    <div className="quote-choices">
                      {group.services.map((service) => (
                        <label
                          key={service.name}
                          className={
                            selected.includes(service.name) ? "chosen" : ""
                          }
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(service.name)}
                            onChange={() => {
                              setSelected(
                                selected.includes(service.name)
                                  ? selected.filter((s) => s !== service.name)
                                  : [
                                      ...selected.filter(
                                        (s) => s !== "Not sure yet",
                                      ),
                                      service.name,
                                    ],
                              );
                              setServicesError(false);
                            }}
                          />
                          <span>{service.name}</span>
                          <Check size={16} aria-hidden="true" />
                        </label>
                      ))}
                    </div>
                  </div>
                );})}
                </div>
                <label className="quote-unsure">
                  <input
                    type="checkbox"
                    checked={selected.includes("Not sure yet")}
                    onChange={() => {
                      setSelected(
                        selected.includes("Not sure yet")
                          ? []
                          : ["Not sure yet"],
                      );
                      setServicesError(false);
                    }}
                  />
                  I’m not sure yet — let’s talk it through.
                </label>
                {servicesError && (
                  <p className="field-error" role="alert">
                    Choose a service, or select “I’m not sure yet.”
                  </p>
                )}
              </fieldset>
            )}
            {step === 1 && (
              <div className="quote-fields">
                <fieldset className="property-choice">
                  <legend>
                    Property type <span>*</span>
                  </legend>
                  <div>
                    {["Residential", "Commercial"].map((type) => (
                      <label
                        key={type}
                        className={draft.propertyType === type ? "chosen" : ""}
                      >
                        {type === "Residential" ? (
                          <House size={21} />
                        ) : (
                          <Building2 size={21} />
                        )}
                        <input
                          type="radio"
                          name="propertyType"
                          value={type}
                          checked={draft.propertyType === type}
                          onChange={() => update("propertyType", type)}
                          required
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <label>
                  Property address <span>*</span>
                  <input
                    name="address"
                    autoComplete="street-address"
                    value={draft.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Street address, city, ZIP code"
                    required
                    maxLength={250}
                  />
                </label>
                <label>
                  What do you have in mind? <span>*</span>
                  <textarea
                    name="message"
                    value={draft.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us about the work, what needs attention, or your ideas…"
                    required
                    rows={3}
                    maxLength={5000}
                  />
                </label>
                <div className="quote-upload">
                  <div className="field-title">
                    Property photos <small>Optional</small>
                    <span>{photos.length}/5</span>
                  </div>
                  <input
                    ref={input}
                    type="file"
                    className="sr-only"
                    tabIndex={-1}
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => addPhotos(e.target.files)}
                  />
                  <button
                    type="button"
                    className="photo-dropzone"
                    onClick={() => input.current?.click()}
                  >
                    <ImagePlus size={24} />
                    <span>
                      <strong>Add photos</strong>
                      <small>Up to 5 · JPG, PNG, WebP · 5 MB each</small>
                    </span>
                  </button>
                  {photoError && (
                    <p className="field-error" role="alert">
                      {photoError}{" "}
                      <button type="button" onClick={() => setPhotoError("")}>
                        Dismiss
                      </button>
                    </p>
                  )}
                  {photos.length > 0 && (
                    <div className="photo-previews">
                      {photos.map((photo) => (
                        <div key={photo.id}>
                          <img src={photo.url} alt={photo.file.name} />
                          <button
                            type="button"
                            aria-label={`Remove ${photo.file.name}`}
                            onClick={() => {
                              URL.revokeObjectURL(photo.url);
                              setPhotos(
                                photos.filter((p) => p.id !== photo.id),
                              );
                            }}
                          >
                            <X size={13} />
                          </button>
                          <span>{photo.file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="quote-fields">
                <label>
                  Full name <span>*</span>
                  <input
                    autoComplete="name"
                    name="name"
                    value={draft.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address <span>*</span>
                  <input
                    autoComplete="email"
                    name="email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    required
                    maxLength={200}
                  />
                </label>
                <label>
                  Phone number <small>Optional</small>
                  <input
                    autoComplete="tel"
                    name="phone"
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="(555) 000-0000"
                    maxLength={30}
                  />
                </label>
                <div className="quote-summary">
                  <div>
                    <strong>Your request</strong>
                    <button type="button" onClick={() => setStep(0)}>
                      Edit
                    </button>
                  </div>
                  <p>{selected.join(" · ")}</p>
                  <p>
                    {draft.propertyType} · {draft.address}
                  </p>
                  <p>{draft.message}</p>
                  <small>
                    {photos.length} photo{photos.length === 1 ? "" : "s"}{" "}
                    attached
                  </small>
                </div>
              </div>
            )}
            <div className="quote-controls">
              {step > 0 ? (
                <button
                  type="button"
                  className="quote-back"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={17} />
                  Back
                </button>
              ) : (
                <span className="quote-free">{selected.length ? `${selected.length} selected` : "Select one or more services"}</span>
              )}
              <button type="submit" className="button button-blue">
                {step === 2 ? "Review Request" : step === 0 ? "Your property" : "Contact details"}
                <ArrowRight size={18} />
              </button>
            </div>
            <details className="quote-privacy">
              <summary>
                <LockKeyhole size={12} />
                Your details stay in this tab.
              </summary>
              <p>
                This preview does not send emails or upload photos. Your entries
                remain available if you close and reopen this quote window, and
                clear when you reload or close the browser tab.
              </p>
            </details>
          </form>
        )}
      </div>
    </div>
  );
}
