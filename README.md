# Mitch’s Landscaping website

Next.js website with Sanity visual editing and a shared Fillout employment application.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. The local server must stay running. The site has not been deployed publicly and remains noindex.

## Owner editing

Open http://localhost:3000/owner or click the footer lock. The owner area lives on Mitch’s website and contains only **Team**, **Portfolio**, and **Careers**. Sanity stores the public content behind the scenes; the owner does not need to open its interface.

### First-time local setup

Deployment preparation is tracked in [LAUNCH.md](LAUNCH.md).

The owner area uses exactly one passkey and has no username/password or email fallback. A trusted operator must run `npm run owner:enroll` on the server to generate a private setup code that expires after 15 minutes. The owner enters this code at `/owner` and personally approves passkey creation on their device. Never paste this code into chat, commit it, or share it. Enrollment closes atomically after the first successful registration; even a signed-in owner cannot add a second passkey.

Development uses **http://localhost:3000/owner**. A localhost passkey will not work on the final public domain. Final production enrollment must happen on the final HTTPS hostname with the production database. A synced passkey can be available on multiple devices through the owner's Apple/Google/password-manager account; it is still one registered credential. Protect that account carefully. There is no public reset route. Losing the only passkey requires a deliberate, trusted server-operator recovery procedure; do not delete the database as routine troubleshooting.

### Everyday updates

- **Team**: add employees, enter names and job titles, upload portraits, reorder, and toggle Show on website. Three employees fit per desktop row below the owner feature; additional employees create new rows.
- **Portfolio**: add project names, descriptions, divisions, locations, completion dates, and photos. Reorder photos to choose the main image. Use Spotlight for a featured card or turn off Show on website to archive a project.
- **Careers**: add a position title and division, then publish. Turn off Accepting applications to close an opening. All roles use the same Fillout form automatically; past applications stay in Fillout.

**Save draft** stores changes privately. **Preview** saves unsaved work as a draft before showing the website; use Back to owner area to continue. **Publish changes** asks for confirmation and updates the public website. A revision conflict asks the owner to reload rather than overwrite newer changes. The owner API cannot edit fixed page copy, service divisions, company settings, or the layout. Other changes go through the developer.

Images must be JPG, PNG, or WebP, up to 10 MB each. Team members and project photos can be removed from their lists without deleting the underlying media asset. Portfolios and openings can be hidden/closed without deleting their documents.

### Private configuration and deployment

Copy `.env.example` when setting up another environment. The public Sanity project is `kjf580ay`, dataset `production`.

- `SANITY_API_WRITE_TOKEN`: private editor token for server-side writes and image uploads. Without it the owner area is read-only. No personal CLI login token is used by the website.
- `SANITY_API_READ_TOKEN`: server-only viewer token for unpublished previews.
- `OWNER_DATABASE_URL`: restricted TLS Postgres connection for Vercel. Apply `database/owner-auth.sql` using the operator-only `npm run owner:db:init` command, seed its owner identifier, and provision the restricted runtime grants listed in the migration. Keep the administrator connection out of Vercel runtime variables. The same one-credential rule, one-use challenges, revocable sessions, and durable throttling work across serverless instances. Never share a production auth database with preview deployments.
- `OWNER_AUTH_DB`: standalone-server alternative; absolute SQLite database path on a persistent, private volume. Production fails closed when no storage is configured. Vercel explicitly rejects SQLite fallback. Use Node 26 with `node:sqlite`, one standalone server or processes sharing the same local durable database, and restrictive filesystem access. This storage contains the public credential, one-use challenges, rate limits, and hashed session tokens; it does not contain the private passkey. It is not suitable for independent serverless instances or network filesystems. Choose suitable hosting before launch; do not copy a development database to a different hostname.
- `OWNER_SITE_ORIGIN`: the exact HTTPS production origin. This is also the WebAuthn relying-party hostname; no wildcard, parent-domain, or client-supplied origin is accepted. Production must set it before enrollment.

User verification is required during enrollment and every sign-in. Challenges expire after five minutes and are consumed once. A unique database constraint allows only one credential, and the setup invitation is consumed in the same transaction. Sessions use random, server-revocable tokens hashed in private storage, HttpOnly and SameSite Strict cookies, a one-hour absolute expiry, and Secure `__Host-` cookies in production. Signing out revokes the session and clears draft-preview cookies. All new sign-in/setup ceremonies are limited to ten per 15 minutes in durable storage (shared single-owner limit; edge/WAF limits are still recommended before launch). Owner pages reject framing and use no-store/no-referrer headers.

**Publishing is intentionally not activated.** Before enabling it, finish scoped content credentials, content backups and restore testing, production HTTPS/domain/storage setup, and an independent security review. Authentication alone does not provide backups or protect against a compromised server/device. Server access and deployment credentials remain separate from owner access. Do not issue a broad Sanity write token as a shortcut.

The local Sanity Studio remains available to the developer at `/studio`, with its restricted content schema; owner-facing links use `/owner`. Add the exact deployed origin to Sanity CORS if using the developer Studio there.

Initial public website content was imported with `sanity exec scripts/seed-sanity.ts --with-user-token`. The import creates missing documents only. Local files in `src/lib` remain startup fallbacks if Sanity cannot be reached. Applicant data is not stored in Sanity or the owner area.

## Forms

Employment application: https://forms.fillout.com/t/uc2iFLoU2Zus

Editor: https://app.zite.com/editor/uc2iFLoU2Zus/edit/aLED

Applications and résumé uploads go directly to Fillout. Notifications are configured for contact@mitchlandscaping.com. Notification delivery has not been tested with a real submission. Closing a website listing does not invalidate previously shared application links.

**The quote form still simulates submission.** Connect its delivery and private photo handling before launch. Source and assets have not been pushed to GitHub or deployed publicly.

## Verification

```sh
npm run typecheck
npx next build --webpack
npm audit
```

Webpack builds are used in this restricted environment because Turbopack’s CSS worker cannot bind its local port. See `ASSET-CREDITS.md` for media sources and `WEBSITE-PLAN.md` for remaining launch work.
