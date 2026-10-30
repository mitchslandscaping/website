# Mitch’s Landscaping — Website specification

Prepared October 27, 2026. The owner approved building with “lets build.” Phase 1 is now implemented locally. Production integrations and public launch remain pending; this approval does not authorize publishing the business site.

## 1. Objective and scope

Create a premium, approachable website for Mitch’s Landscaping that generates a balanced mix of residential and commercial inquiries. No single service should dominate the messaging.

The public marketing experience is one scrolling homepage. Major sections use smooth-scrolling navigation. Supporting privacy information and the authenticated editor may have separate utility URLs; these do not expand the marketing site into multiple pages.

Primary action: **Request an Estimate**. Secondary action: **Call Mitch’s**, visible only after a phone number has been entered.

Estimates are free. Do not advertise free site visits; that has not been agreed. Response copy: “We aim to respond the same day or by the next business day. Some projects require a site visit before we can provide an estimate.”

Target: an initial visual prototype tonight, after approval. Production integrations and launch follow in later phases; the prototype is not the live business website.

## 2. Visual direction

Current approved direction: retain the floating white navigation of [Runrollout](https://runrollout.com/) and use [Brian’s Lawn Maintenance](https://www.brianslm.com/index.html) as the main reference for bold contractor typography, photographic service panels, an early company introduction, benefits, and a clear estimate process. Mitch’s uses its own blue-and-black identity and service content. Brian’s supersedes the earlier BP Marine reference for the body layout; do not reuse another company’s copy, reviews, credentials, or photographs.

- Fencing announcement: a compact dark pill above the floating navigation, matching Rollout’s treatment with a blue circular arrow. Copy: “Thinking about a new fence? Get a free fencing quote.” It hides after scrolling 36px and returns at the top; navigation moves upward. Banner text, enabled status, and selected service are content fields for the future CMS. The action starts the guided quote on Services with Fencing selected, preserving other draft details.
- White, rounded navigation bar inset from the viewport edges; logo left, section links in the middle, blue estimate button right. Keep the navigation accessible while scrolling and prevent it from covering anchor headings.
- Current hero direction: full-screen muted looping owner-supplied Rollout Hero V7 video with a dark readability overlay. Large white Barlow Condensed headline reads “Landscape. Build. Maintain.” on the left; concise supporting copy and Request Quote sit alongside it. Use Mitch’s blue for the short eyebrow banner and CTA. Stack copy on phones, allow extra height when content needs it, retain the 86px navbar, autoplay continuously with no visible play/pause button or native controls, as requested by the owner; use a poster while loading or when the browser blocks autoplay. This supersedes the light split-photo hero and Rollout-centered hero.
- Use the supplied SVG logo. It contains vector shapes and is approximately 14 KB. Its source blue is `#2C7EF1`; preserve the original logo colors.
- Current palette: original logo blue, bright accent blue `#2C7EF1`, action blue `#2168DF`, near-black `#101216`, white `#FFFFFF`, and cool off-white `#F4F6F9`. Validate text and control contrast during implementation; decorative brand blue need not be the button background.
- Current typography: locally hosted Poppins, matching the reference’s font family, with weights 400–800 and a system sans-serif fallback. The script lettering belongs to the logo, not general website text.
- Approved Brian’s-inspired refinement: retain the floating rounded header; use bold Poppins headings, a left-aligned photographic hero, a black service-summary strip, a white company introduction, two full-image service panels with descriptions and Explore services buttons that open detailed service dialogs, and a near-black “Why Mitch’s” section. Add a simple three-step estimate explanation. Keep gallery captions beneath the images and use brief interaction feedback with reduced-motion support. Do not invent trust statistics or testimonials.
- Desktop content width approximately 1,200–1,280 pixels. Responsive type and spacing; body text generally at least 16 pixels. Motion should be brief and respect reduced-motion preferences.

Use licensed stock photography initially for the hero and service illustrations. Record each asset’s source and usage rights. Never label stock imagery as completed Mitch’s projects. Select photos that accurately illustrate the offered work and can later be replaced in the editor.

## 3. Homepage and navigation

Current prototype order: **Hero → Black service-summary strip → About → Services → Google review link → Why Mitch’s → Company positioning → Inspiration Gallery → How It Works → Service Area (when supplied) → Blue quote call-to-action → Footer**. This updates the earlier section order to follow the newly approved Brian’s direction.

| Section | Content and behavior |
| --- | --- |
| Hero | Logo, balanced residential/commercial message, large photo, estimate action, optional call action. Current hero headline: “Love your / outdoors. / Choose Mitch’s.” The middle word cycles through outdoors, landscape, and backyard, with reduced-motion support. |
| Trusted by | Dark full-width strip immediately after the hero, centered editable heading, and a continuous horizontal logo row. Actual customer logos only; visibly marked placeholders during prototyping. |
| Services | Two equal main groups. Each service has an editable title, short explanation, and optional photo. No separate service pages at launch. |
| About | Company introduction and optional photo. The prototype uses a factual service summary and a labeled stock team-photo placeholder. The owner’s actual story and photo are still needed; no invented history or credentials. |
| Project Gallery | Simple curated grid; tap or click to enlarge. Optional captions. Owner can add, remove, and reorder photos. No filters or complicated project navigation. Hidden until real project imagery is supplied. |
| Reviews | Google Business connection, authentic reviews if an approved integration is configured, and a link to Google. Details below. |
| Why Mitch’s | Four factual reasons based on service breadth, residential/commercial availability, practical outdoor improvements, and the free-estimate process. |
| How It Works | Three steps: share the work, discuss details/site visit if needed, and review a free estimate. |
| Service Area | Editable list of cities plus optional introductory text. Hidden while empty; no invented geographic coverage. |
| Estimate | Blue closing call-to-action opening the three-step quote dialog, with clear free-estimate messaging and an optional call alternative. |
| Footer | Logo, contact details, available section links, Google Business link, privacy link, and discreet Owner login. |

Recommended desktop navigation: Services, About, Our Work, Reviews, Service Area, and the estimate button. Omit links to hidden sections; reduce link count or switch to the menu layout before the bar becomes crowded. The logo returns to the top. Request Quote buttons open the guided quote dialog over the current page. The closing quote section replaces the long inline form.

Keep the overall section order fixed. Empty sections disappear without leaving gaps or broken navigation. Owner visibility controls are limited to optional content sections; no general drag-and-drop page builder.

## 4. Services

### Landscaping & Lawn Care

- Lawn maintenance
- Landscape maintenance
- Landscape design/build
- Landscape architecture
- Herbicide treatments

### Hardscaping & Construction

- Retaining walls
- Pavers and patios
- Brick walls
- Drainage
- Fencing
- Access control

Present all offerings to residential and commercial customers. Descriptions should explain customer outcomes in plain language. Avoid inventing certifications, licenses, guarantees, or specific access-control systems. Confirm the exact scope of technical offerings before production publication. Design/build content should explain planning and installation without duplicating the hardscaping group.

## 5. Estimate experience and emails

Recommended form fields:

| Field | Requirement |
| --- | --- |
| Full name | Required |
| Email | Required for the requested confirmation email |
| Phone | Optional, to keep the initial inquiry easy |
| Property address | Required; label clearly as the project location |
| Residential or commercial | Required |
| Services of interest | Required; allow multiple selections and “Not sure yet” |
| Project description | Required |
| Photos | Optional, maximum five |

Updated by explicit owner approval: use a three-step guided quote dialog rather than a long homepage contact form. Steps: (1) choose services, (2) property type, address, work description, and optional photos, (3) contact details and a request summary. The owner selected this interaction after reviewing the Brian’s reference. No customer account or budget requirement.

Validate each step before continuing, allow Back and editing from the summary, and retain entries and selected photos when the dialog closes and reopens in the same tab. The prototype clears data on reload; no browser persistence or network submission. Preserve accessible focus, Escape dismissal, and a mobile scrolling layout. The final prototype action is clearly labeled “Preview Quote Request”; live wording changes only when intake is connected.

Photo handling recommendation: JPEG, PNG, and WebP; up to 5 MB per file. Explain supported formats before selection. Provide previews, removal, upload progress, and clear per-file errors. Evaluate HEIC conversion during implementation; do not silently accept an unsupported phone image format. Server-side validation must verify actual file type, quantity, and size. Strip location metadata when processing images. Customer uploads never enter the public gallery or public CMS asset library.

Production submission flow:

1. Validate the request and apply spam controls.
2. Save the request and its private photo references durably with a unique reference number.
3. Send a team notification to `estimates@mitchlandscaping.com` and a separate branded customer confirmation.
4. Show “Request received” only after the request has been safely recorded. If email is delayed, the stored request remains recoverable and delivery can be retried.

Use idempotency to avoid duplicate requests and confirmations on repeated clicks. Preserve entered text after recoverable failures. Track notification outcomes and provide an operational way to inspect and retry failed deliveries before launch. This is a submission workflow, not a new CRM.

Team email: contact information, selected services, project description, request reference, and authorized access to uploaded photos. Set Reply-To to the customer.

Customer email: Mitch’s branding, logo, readable blue accents, request summary, response expectation, free-estimate wording, and contact details when supplied. Reply-To is `estimates@mitchlandscaping.com`. Avoid claiming an appointment or price has been confirmed. Use an email-compatible raster version of the logo plus alt text, rather than relying on SVG support in email clients.

Set up `estimates@mitchlandscaping.com` in Google Workspace as a Google Group delivering to the owner’s chosen recipients. Collaborative Inbox features are optional. It must accept legitimate external customer replies and keep membership/conversations private. [Google’s guide](https://support.google.com/a/users/answer/10375787?hl=en)

## 6. Editing experience and CMS architecture

Use Sanity Studio with a simplified navigation and a live website preview. Click-to-edit opens the relevant content field; draft changes are previewed before Publish. Sanity supports these preview capabilities. [Sanity visual editing](https://www.sanity.io/docs/visual-editing/introduction-to-visual-editing)

| Content model | Editable fields |
| --- | --- |
| Site settings — one record | Company name, logo, phone, public email, Google Business URL, social links if supplied, default SEO title/description, social preview image |
| Homepage — one record | Hero headline, supporting text, hero image/crop, section headings, company story and image, estimate introduction, response wording, optional-section visibility |
| Service — repeatable records | Title, description, group, optional image/alt text, display order, active status |
| Gallery image — repeatable records | Real project photo, caption, alt text, display order, active status |
| Service areas — one record | Introductory text and editable city list |
| Trusted by settings — one record | Enabled toggle, heading, ordered customer logo list; each entry has a customer name/alt text and replaceable logo image. Add, remove, and reorder. |
| Reviews settings — one record | Google listing link, enable/disable; provider identifiers configured during integration |
| Privacy content — one record | Approved privacy notice and contact information |

Image controls include replacement, crop/focal point, and meaningful alt text. Validate required fields, URLs, email addresses, and reasonable text lengths. Changing services updates the public service list and the estimate choices consistently. Keep hidden or incomplete content out of navigation and structured data.

Fixed design controls: fonts, palette, spacing, section order, breakpoints, and component layout. The owner edits content, not CSS or arbitrary HTML. Larger design changes come through future development.

Discreet “Owner login” in the footer opens the authenticated editor. The link is subtle but keyboard-accessible; security comes from authentication and authorization, not hiding the URL. Restrict editing to invited users. A simplified editor interface is distinct from granular role enforcement; assess paid Sanity roles only if separate staff permissions become necessary.

Keep marketing content in Sanity. Do not put customer inquiries, photos, delivery logs, or secrets in a public Sanity dataset. Sanity’s Free plan currently includes visual editing but public-only datasets. [Sanity pricing](https://www.sanity.io/pricing)

## 7. Technical architecture

- Next.js with TypeScript for the public site, supporting utility routes, and server-side form processing.
- Tailwind CSS for a consistent responsive design system.
- Sanity for public marketing content and the owner’s editing workflow. Published content serves the public site; draft preview is protected and never cached as public content. Publishing triggers authenticated content refresh.
- GitHub for source control. Repository name and access are still needed before pushing code; local prototyping does not require a repository connection. Do not store credentials or customer submissions in Git.
- Vercel Pro for hosting, HTTPS, preview deployments, and server functions. The owner retains control of the accounts.
- Resend for transactional notifications and confirmations, with a verified sending domain/subdomain. Keep existing Google Workspace mail routing intact.
- Recommended private upload and request store: Vercel Blob in private mode, with server-only credentials. Each submission has a durable record and photo references. An authenticated team-only route authorizes photo access; guessing a URL is insufficient. Final SDK availability must be verified during implementation because the current private-storage documentation labels the feature beta. [Private storage](https://vercel.com/docs/vercel-blob/private-storage)
- Before live intake, implement scheduled delivery retries, deduplication, failed-delivery visibility, and removal of abandoned uploads. No email-only success path that can silently lose an inquiry.

Use separate development and production configuration. Keep secrets server-side, verify webhook signatures, restrict allowed upload origins and destinations, and prevent email-header injection. Use server-side validation, a honeypot, and persistent rate limiting; add a challenge only if needed. Store minimal operational logs and avoid logging form contents.

Proposed retention: delete unsubmitted uploads after 24 hours and website-held request/photo copies after 90 days. Email copies have their own Workspace retention. The owner must confirm retention before live intake. Provide a privacy notice explaining contact information, photos, processors, and how to request deletion. Customer material is not authorized for marketing use by an estimate submission.

## 8. Mobile, accessibility, and performance

- Keep the navbar 86px tall with an unchanged 186px logo across screen widths. Above 1024px, show the logo, centered links, and Request Quote. At 1024px and below, show only the logo and hamburger; put Request Quote inside the dropdown menu. The dropdown floats below the bar without changing its height and closes when returning to desktop. Show tap-to-call after the number is configured.
- One-column content and form at narrow widths; no horizontal overflow. Test at 360-pixel width, common phone sizes, tablet, and desktop.
- Preserve photo focal points across crops. Load the hero appropriately, lazy-load lower imagery, generate responsive sizes, and reserve image dimensions to avoid layout jumps.
- Target WCAG 2.2 AA: sufficient contrast, visible focus, semantic headings, accessible labels/errors, comfortable touch targets, and keyboard-operable menu and gallery. Close the gallery with Escape and restore focus to its trigger.
- Smooth scrolling respects reduced-motion settings. No scroll hijacking, autoplay carousel, or unnecessary video.
- Verify performance with representative images and mobile testing; treat Lighthouse scores as diagnostics rather than a promise of search ranking.

## 9. Google visibility and reviews

Provide indexable server-rendered service content, one clear main heading, logical section headings, descriptive metadata, canonical URL, sitemap, robots configuration, image alt text, social preview, and factual LocalBusiness structured data. Next.js supports metadata and related file conventions. [Metadata documentation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)

Use `https://mitchlandscaping.com` as the primary address and redirect the alternate www hostname. Keep business name, contact details, and service areas consistent with the verified Google listing. Connect Search Console and submit the sitemap at launch when account access is available. Preview and editor URLs must not be indexed; noindex does not replace authentication.

A single-page launch supports the requested simple experience. It offers less room for distinct service and location content than dedicated pages; consider those later based on real search performance. Do not promise rankings or produce fabricated city pages. Actual service areas are still needed for useful local targeting.

Owner-supplied Google listing URL: `https://share.google/A2zeRekIZVP2YXKMN`. Store it as editable content; the listing identity and review availability have not yet been verified.

For tonight’s prototype, show a real Google-listing link or an explicitly labeled design placeholder, never invented stars or testimonials. For production, resolve the listing and choose a supported reviews integration within budget. A native Google Places integration can return at most five reviews, sorted by relevance; it is not a complete review feed. Preserve author attribution, required Google attribution, and links, and follow applicable refresh/storage rules. [Google Places review reference](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) and [display policies](https://developers.google.com/maps/documentation/places/web-service/policies)

Recommended launch fallback if review integration is not ready: a polished “Read our reviews on Google” link without a manually maintained rating. Automatic review display and any provider fees remain a production decision, not a blocker for the visual prototype.

Start without advertising trackers. Search Console and essential operational monitoring are sufficient initially; add visitor analytics later if useful, with the appropriate privacy choices.

## 10. Hosting, costs, and maintenance

The domain remains registered at GoDaddy; business email remains with Google Workspace. Connect web DNS to Vercel at launch while preserving mail records. Configure the transactional sender’s authentication records without replacing existing Workspace configuration. Test both inbound and outbound email after changes.

Approved planning budget: **$30–$50 per month**, aiming close to **$20 at low launch usage**, before taxes and existing domain/email costs.

| Service | Current planning allowance |
| --- | --- |
| Vercel Pro | $20/month base for the initial setup, plus applicable usage; Hobby is not for a commercial business site. [Pricing](https://vercel.com/pricing) |
| Sanity Free | $0 within limits; upgrade only if needed. [Pricing](https://www.sanity.io/pricing) |
| Resend Free | $0 within 3,000 emails/month and 100/day. Normally two sends per estimate; retries and other sends also use quota. Pro is currently $20/month if needed. [Pricing](https://resend.com/pricing) |
| Private storage and functions | Usage-based; reserve part of the budget cushion and configure spend alerts. [Blob pricing](https://vercel.com/docs/vercel-blob/usage-and-pricing) |
| Google reviews | Provider or API costs unresolved; avoid an added subscription without approval. |

Domain renewal, Google Workspace, paid stock licenses, and development/maintenance labor are separate. The $20 figure is a base estimate, not an all-inclusive cap. No paid plan will be purchased during prototyping without the owner’s authorization.

Maintenance plan: periodic dependency/security updates, form and email-delivery checks, broken-link checks, restore testing, content exports, and monitoring of usage and account renewals. Retain source history and document deployment rollback. Hosting does not automatically include ongoing development or active human monitoring.

## 11. Phased implementation and progress visibility

### Phase 1 — Visual prototype, target tonight after approval

Create the Next.js/Tailwind foundation locally with the real SVG logo, licensed stock imagery, the approved design direction, service content, responsive navigation, and estimate-form layout. Provide the phone field and empty-content behavior in the content model without inventing missing business details.

Show the complete approved page composition for review. Any sample About, gallery, or reviews panels used to assess layout must be visibly identified as prototype material and kept separate from production content. Default public behavior still hides empty sections.

Demonstrate form validation and optional photo selection locally. Clearly identify the form as a preview: it sends no emails and stores no real customer requests. The footer login can be represented as a labeled preview until authentication is configured; do not present a fake working editor.

Open a local browser preview beside the chat once the first coherent version is ready. Share short updates after meaningful milestones: hero/navigation, services and lower sections, then mobile/form review. The owner can comment on the visible prototype. GitHub is not required to see local progress; the local preview is available while its server is running.

### Phase 2 — Owner content editing

Connect the approved GitHub repository and owner-controlled Sanity project. Implement the simplified schemas, authenticated editor, logo/image changes, draft preview, publishing, hidden-section rules, and services/form consistency. Verify an owner can make representative changes without touching code.

### Phase 3 — Live inquiries and integrations

Configure the Google Group, authorized recipients, verified email sender, branded templates, private storage, team photo access, retries, retention, and spam protection. Resolve the Google listing and selected review approach. Add privacy content. Test successful and failed submissions, large/invalid files, duplicate clicks, and delayed or failed email delivery.

### Phase 4 — Production launch

Add the real phone number, service areas, and approved business descriptions. About and gallery may remain hidden if not ready. Test keyboard/mobile usability, image performance, SEO metadata, working calls and links, real email delivery, and unauthorized-access rejection. Confirm private uploads cannot be accessed publicly.

Deploy an owner-approved production version, connect GoDaddy DNS without disrupting Google email, verify HTTPS and redirects, connect Search Console, and hand over a short editing/operations guide. Obtain approval before making the business site public; prototype approval alone is not production-launch approval.

## 12. Remaining inputs and decisions

**Phase 1 status:** approved and implemented locally; current visual revision follows the owner’s Brian’s reference. Existing logo and permission to use stock photography are already available. No GitHub password, token, or other secret should be pasted into the chat.

**Needed before integrations or launch:**

- GitHub repository URL and authorized connection; owner-controlled Sanity/Vercel/Resend accounts when those phases begin.
- Google Workspace group setup and intended recipients; confirm `estimates@mitchlandscaping.com` is active before using it publicly.
- Editable phone number and service-area cities. Company story and real project photos can follow later.
- Verify the Google listing and decide on the automatic review integration and its cost.
- Confirm the proposed form requirements, upload limits/formats, and 90-day website storage retention; these are recommendations rather than previously supplied business rules.
- Confirm team sign-in accounts for private customer photo access.
- Confirm accurate service wording and any credentials the owner wants to claim; no unverified credentials are published.
- Approve final privacy information, copy, stock imagery, and production launch.

The fixed design, simple editor, two service groups, approved section order, free estimates, optional five-photo upload, branded confirmation email, editable phone/service areas/Google link, and monthly planning budget are settled. These open inputs do not prevent a visual prototype once the plan is approved.

## Trusted by editing preview

Implemented a browser-only no-code preview under **Owner login → Preview Trusted by editor**. It supports heading edits, show/hide, up to 12 customer entries, logo upload/replacement/removal, customer names, ordering, and reset. PNG/JPG/WebP/SVG uploads are limited to 250 KB each for local storage. Saving persists only in the current browser and origin; it is not authentication, CMS publishing, or cross-device sync. The production Sanity version will replace local storage with authenticated content management and asset uploads. Empty lists show clearly marked placeholders during this prototype; hide empty content before public launch. Scrolling pauses on hover/focus and becomes static for reduced-motion preferences.
