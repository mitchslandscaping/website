"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type Photo = { src: string; alt: string; caption?: string };

export default function ProjectPhotoCarousel({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => setEdges({ start: element.scrollLeft <= 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [photos.length]);
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const item = element.firstElementChild as HTMLElement | null;
    element.scrollBy({ left: direction * ((item?.offsetWidth ?? 300) + 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section id="project-all-photos" className="project-photo-section photo-carousel" aria-labelledby={`${id}-heading`} aria-roledescription="carousel">
    <div className="project-photo-heading"><h2 id={`${id}-heading`}>More project photos</h2><div className="photo-carousel-controls"><button type="button" onClick={() => move(-1)} disabled={edges.start} aria-label="Previous photos" aria-controls={id}><ArrowLeft size={18} /></button><button type="button" onClick={() => move(1)} disabled={edges.end} aria-label="Next photos" aria-controls={id}><ArrowRight size={18} /></button></div></div>
    <div id={id} className="photo-carousel-track" ref={track} tabIndex={0} aria-label="Project photos; scroll horizontally for more" onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>
      {photos.map((photo, index) => <figure key={photo.src} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${photos.length}`}><div className="photo-carousel-image"><Image unoptimized={photo.src.startsWith('/api/media/')} src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 75vw, 300px" /></div></figure>)}
    </div>
  </section>;
}
