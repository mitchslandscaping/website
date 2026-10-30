"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Dialog from "./dialog";
import { useWebsiteContent } from "./website-content";
import { applicationUrl, type Position } from "@/lib/careers";

export default function CareersBoard() {
  const { positions, home } = useWebsiteContent();
  const [selected, setSelected] = useState<Position | null>(null);
  const openings = positions.filter((position) => position.active);
  return <>
    <section className="careers-section careers-board" id="careers" aria-labelledby="careers-heading">
      <div className="container careers-board-layout">
        <div className="careers-board-intro">
          <p className="company-eyebrow">CAREERS AT MITCH’S</p>
          <h2 id="careers-heading">{home.careersHeading}</h2>
          <p>{home.careersIntro}</p>
          <div className="careers-board-signoff">Local roots. Working together since 1989.</div>
        </div>
        <div className="careers-positions" aria-labelledby="open-positions-heading">
          <div className="careers-positions-header"><h3 id="open-positions-heading">Current openings</h3><span>{openings.length} {openings.length === 1 ? "position" : "positions"}</span></div>
          <ul className="careers-positions-list">
            {openings.map((position) => <li key={position.id}>
              <button className="career-position-button" onClick={() => setSelected(position)} aria-label={`Apply for ${position.title}`}>
                <span><span className="careers-role-category">{position.division.toUpperCase()}</span><span className="career-position-title">{position.title}</span><span className="careers-role-status"><span aria-hidden="true" />Now hiring</span></span>
                <span className="career-apply">Apply now <ArrowUpRight size={18} aria-hidden="true" /></span>
              </button>
            </li>)}
          </ul>
          {!openings.length && <div className="careers-positions-footer"><p>There are no current openings. Please check back for future opportunities.</p></div>}
        </div>
      </div>
    </section>
    {selected && <Dialog title={`Apply for ${selected.title}`} className="career-application-dialog" onClose={() => setSelected(null)}>
      <div className="career-application-toolbar"><a href={applicationUrl(selected)} target="_blank" rel="noopener noreferrer">Open form in a new tab <ArrowUpRight size={14} /></a></div>
      <iframe src={applicationUrl(selected)} title={`Employment application: ${selected.title}`} className="career-application-frame" />
    </Dialog>}
  </>;
}
