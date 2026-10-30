# Phase 1 verification

Verified October 27, 2026 against the local Next.js preview.

- TypeScript check passes.
- Optimized production build passes.
- Desktop and 390 × 844 mobile layouts visually inspected, including floating header, mobile menu, gallery, and estimate form.
- Navigation scrolls to sections; service details expand and a specific service link preselects the corresponding estimate choice.
- Required-service validation presents an error and focuses the service group.
- Prototype confirmation works both with selected photos and without photos.
- Two local JPEG files selected successfully and shown in the photo preview list. Uploads do not leave the browser. Quantity, MIME type, and size limits are implemented; all rejection branches have not yet been browser-tested.
- Entered form values are retained when returning from the simulated confirmation.
- Gallery next-image control and left-arrow keyboard navigation work. Escape closes the gallery; focus returns to its opening button.
- Mobile menu opens and closes. Owner-login control explains the pending integration instead of collecting credentials.
- Initial Next Image quality warning was corrected by configuring the supported quality values.

Screenshots are kept locally in ignored `qa/` files. These are development checks, not a full production accessibility or security audit. Live email delivery, Sanity access, private storage, Google review importing, public SEO indexing, and DNS are intentionally not configured in Phase 1.

## Visual refinement verification — October 28, 2026

- Retained the floating Rollout-inspired header and photographic hero.
- Replaced service cards with alternating open image/detail compositions, added a charcoal company section, moved gallery captions below images, and refined typography and warm neutral surfaces.
- Replaced decorative counters and generic slogans with service-focused copy; added a concise estimate next-steps explanation.
- Inspected desktop, 390px mobile, and 768px tablet layouts. Verified document width does not overflow at 320px, 390px, and 768px; corrected the form grid's intrinsic minimum width at 320px.
- Verified mobile menu open/close through navigation, service accordion expansion, and selection of lawn maintenance through its estimate link.
- Verified gallery next control, Escape dismissal, and return of focus to its trigger.
- Completed the estimate preview without optional photos using fictional test details; verified returning to the form retains those entries. Upload handling code was unchanged and was not re-tested in this visual pass.
- TypeScript and production build pass. Screenshots: ignored `qa/refined-desktop.jpg` and `qa/refined-mobile.jpg`.
- This remains a local prototype: email, CMS, and production publication are not connected.

## Brian’s-inspired revision verification — October 28, 2026

- Added heavy headings, a blue service-summary strip, an early company introduction, two photographic service panels, a black Why Mitch’s section, and a three-step estimate process. Retained the floating header.
- Reviewed desktop, 390px and 320px phone, and 768px tablet layouts. Document width matched viewport content width at each mobile/tablet size. Corrected gallery photo alignment where captions wrap to different lengths.
- Verified mobile navigation closes after selection, service details expand, and a service estimate link preselects Lawn maintenance.
- Submitted the local preview using fictional test information without photos; verified the simulated confirmation and preservation of details when returning to the form. Reloaded afterward to clear test entries.
- Verified gallery next-image navigation, Escape dismissal, and focus restoration. No browser console errors were reported.
- TypeScript and optimized production build pass. Screenshot: ignored `qa/brians-direction-services.jpg`.
- Email delivery, CMS editing, and public deployment remain pending. New stock photography is credited in ASSET-CREDITS.md and is not presented as Mitch’s team or completed work.

## Closer reference layout and guided quotes — October 28, 2026

- Matched the reference’s Poppins typography, wider alignment, photo-overlay service cards, centered benefits, light/dark section rhythm, and closing call-to-action. Preserved the floating header and Mitch’s identity.
- Replaced the inline form with a persistent three-step quote dialog. Service details open in a separate dialog and can preselect the quote service.
- Verified empty service selection is rejected, required property details prevent continuing, Back/Edit retain entries, and closing/reopening preserves the draft. Completed simulated requests without photos and with one local JPEG.
- Tested mobile quote links, service-dialog handoff, Escape, focus restoration, and scroll unlocking. Each step resets the dialog scroll position to the top.
- Inspected desktop, 390px and 320px phone, and 768px tablet layouts. No document/dialog horizontal overflow in the tested narrow layouts.
- Fixed a malformed quote-link selector discovered during browser testing. Retested hero and mobile quote links and service-to-quote flow successfully; no additional console errors appeared after the fix.
- Production build and TypeScript pass. Screenshots: ignored `qa/closer-reference-home.jpg` and `qa/guided-quote-desktop.jpg`.
- All requests remain simulated. No emails, external photo uploads, CMS connection, or public deployment.

## Fencing announcement — October 27, 2026 (America/Chicago)

- Added the Rollout-style dark announcement pill, blue arrow, and fencing promotion using content-adapter fields.
- Verified quote opening with Fencing selected; re-entering from the banner returns to Services while retaining the draft.
- Verified the banner hides after scrolling, navigation moves to 12px from the top on desktop, and the banner returns at the top.
- Inspected the 390px mobile layout with no horizontal overflow. Production build and TypeScript pass.
- Screenshot: ignored `qa/fencing-announcement.jpg`.

## Rollout-matched hero — October 27, 2026 (America/Chicago)

- Matched measured desktop reference geometry: 1,240px maximum navbar width, 86px height, 18px navbar corners, 12px button corners, and centered navigation. Added scoped Plus Jakarta Sans/Syne fonts, centered three-line type, capsule label, and rotating middle words with reduced-motion support.
- Changed the hero photograph to the licensed landscaped-home image at the owner’s request.
- Inspected desktop and 390px/320px layouts with no horizontal overflow. Verified the hero quote action and fencing-banner preselection. Production build and TypeScript pass.
- Screenshot: ignored `qa/rollout-hero-landscape.jpg`.

## Stable navbar — October 27, 2026

- Removed conflicting header/logo size changes from the hero stylesheet. Navbar height stays 86px and logo width stays 186px; tablet navigation switches at 1024px.
- Browser measurements at 1450, 1100, 1025, 1024, 900, 768, 390, and 320px confirmed constant height/logo size, correct desktop/menu/quote visibility, and no horizontal page overflow.
- Verified the open mobile dropdown leaves the bar at 86px, closes on transition to desktop, and stays closed when returning to mobile. Its Request Quote link opens the guided quote dialog.
- Visually inspected the tightest desktop layout (1025px) and mobile layout (390px). Mobile screenshot: `qa/navbar-mobile-fixed-height.jpg`.
- TypeScript check and production build passed. The sandboxed build stalled; rerunning outside the sandbox completed successfully.

## Independent hero redesign — October 27, 2026

- Replaced centered photo-overlay hero with a light split composition, static serif headline, concise copy, blue quote action, and separate garden photograph. Removed rotating headline state/timer and Syne font import.
- Measured layouts at 1450, 1025, 1024, 768, 760, 390, and 320px: no horizontal overflow; navbar remains 86px. Visually reviewed desktop and narrow mobile.
- Verified the new Request Quote link opens the guided quote dialog and Explore services targets the services section.
- TypeScript check and production build passed. Desktop preview: `qa/hero-editorial-desktop.jpg`.

## Video hero — October 27, 2026

- Added full-screen locally served stock mowing video, white condensed headline, blue eyebrow/quote button, and supporting copy beside the headline; mobile stacks the content. Source and license recorded in ASSET-CREDITS.md.
- Browser confirmed playback, muted audio, loaded video dimensions, pause/resume control, and quote dialog opening. Poster fallback and reduced-motion handling implemented; reduced-motion preference was reviewed in code rather than OS-emulated.
- Checked 320, 390, 640, 768, 1024, and 1450px widths without horizontal page overflow. Desktop hero fills the viewport; navbar stays 86px. Narrow headline sizing adjusted to avoid clipping at 320px.
- Desktop screenshot: `qa/video-hero-desktop.jpg`. TypeScript and production build passed.

## Owner video replacement — October 27, 2026

- Replaced hero footage with a full-length 1080p copy of the supplied Rollout Hero V7 video (13.31 seconds, approximately 17 MB); source file left untouched. Extracted a matching poster.
- Removed custom play/pause UI and related CSS. Native controls are disabled; video uses autoplay, muted, loop, and playsInline. Per the owner’s explicit always-play request, the previous reduced-motion pause behavior was removed. Browser-level autoplay restrictions can still leave the poster visible.
- Browser confirmed correct local source, active muted playback, readyState 4, looping, controls false, and zero video control buttons. Playback continued through the loop.
- TypeScript and production build passed. Screenshot: `qa/rollout-v7-video-hero.jpg`.

## Editable Trusted by strip

- Inspected Brian’s desktop reference and added a dark, centered-heading customer logo marquee directly after the hero. No reference-company logos were copied. Empty defaults use clearly labeled layout placeholders.
- Verified animation advances, equal-width duplicated groups provide a continuous loop, and focus pauses animation. Reduced-motion static wrapping is implemented in CSS.
- Visually checked desktop and 390px phone layouts; 320px check showed no horizontal overflow. Desktop screenshot: `qa/trusted-by-desktop.jpg`.
- Exercised Owner login → Preview Trusted by editor: heading edit, SVG upload using the existing Mitch’s logo as temporary test data, second customer, reordering, save, reload persistence, removal, hide, and reset. Reset removed test content; placeholders restored.
- Editing is explicitly browser-local storage only, without authentication, publishing, or cross-device sync. Source content model and CMS plan include heading, visibility, customer names, logo images, and ordering.
- TypeScript and production build passed. Restarted the LAN preview on port 3001 and confirmed it serves the new section at http://192.168.4.35:3001.

## Sanity visual editor — October 29, 2026

- Company Sanity project `kjf580ay`, public `production` dataset imported with approved website media. No applicant records imported.
- Authenticated Studio at `/studio`; Presentation is the first tool. Footer lock opens visual editing. Content manager includes projects, divisions, jobs, and company/contact settings.
- Verified directly clicking the homepage headline selects its exact field and clicking the logo selects its image control.
- Temporarily edited the first headline in Studio: the draft updated the preview automatically while an unauthenticated HTTP request retained the published headline. Restored `Landscape.` and published the restored original. No test copy remains.
- Unauthorized `/api/draft-mode/enable` request returns 401.
- Confirmed server-only read credential does not appear in public JavaScript bundles.
- Verified the two existing job-opening documents and their Accepting applications control. No test application sent.
- TypeScript check and production webpack build pass. Turbopack build blocked by this environment’s CSS worker port restriction. npm audit reports zero vulnerabilities after compatible transitive dependency patches.
- Site remains local and noindex. Quote submissions remain a simulation; deploy/email delivery are separate launch work.

## Branded owner area — October 29, 2026

- Footer lock and legacy owner anchor now open `/owner` on Mitch’s website. Custom UI exposes only Team, Portfolio, Careers; fixed content is not accepted by its API.
- Local first-run password setup is waiting for the human owner; no default or production owner password was created. Setup uses scrypt hashing and a private ignored credentials file. Production first-run setup is disabled.
- iron-session cookie checks tested on a separate localhost:3001 production instance with disposable credentials: authenticated read access, unsigned/tampered/expired sessions rejected, password-version mismatch rejected, cross-site writes rejected, failed password handling, six-attempt throttle, safe preview URL handling, and logout cookie deletion passed.
- Read-only connection correctly rejects publishing while the separate server editor token is absent. Full publishing/upload integration testing awaits explicit authorization for that credential.
- Browsed Team/Portfolio/Careers screens using actual public content on the isolated test instance. Existing names, project metadata/photos, and job openings loaded correctly.
- TypeScript and production webpack build pass. Owner UI screenshots: `/tmp/mitch-owner-sign-in.png`, `/tmp/mitch-owner-dashboard.png`.
- The actual site remains local. Before deployment, configure private production credentials, exact HTTPS origin, durable credential storage or environment secrets, and a shared login limit if deploying multiple server instances. Applications remain in Fillout; quote delivery is still a simulation.

## Passkey-only owner access — October 29, 2026

Supersedes the earlier username/password setup. The website now accepts one WebAuthn credential using SimpleWebAuthn, with required user verification, exact relying-party/origin verification, and no password/email/reset fallback. First enrollment requires a server-generated 15-minute invitation; an atomic singleton database constraint prevents additional credentials. Challenges expire after five minutes and are consumed once. Private SQLite stores the public credential, challenges, hashed revocable session tokens, and durable sign-in limits. Production requires an explicitly configured durable database and HTTPS origin. Cookies are HttpOnly/SameSite Strict, Secure and __Host-prefixed in production, with one-hour absolute sessions. Logout revokes the database session. Owner pages reject framing.

`npm run test:owner` uses a disposable private database and local production server with a software EC authenticator. It tests valid registration/signatures, missing private enrollment code, closure after first enrollment, wrong credential/origin/RP/signature, required user verification, challenge consumption and expiry, concurrent-store enrollment protection, session tampering/expiry/revocation, durable rate limiting, and disabled publishing. No real owner passkey has been enrolled. Browser verified `/owner`; screenshot `/tmp/mitch-owner-passkey.png`.

Before launch: enroll the human owner's passkey on the final HTTPS domain, choose durable private server storage (current SQLite design is for a single server), complete scoped publishing credentials and backups/restore testing, and obtain an independent security review. Publishing remains disabled; no Sanity write token was issued. Authentication does not guarantee immunity from server/device compromise.
