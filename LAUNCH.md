# Mitch’s Landscaping launch

Target: Vercel in the **Mitchs Landscaping** workspace; domain stays at GoDaddy. Keep Google Workspace MX/TXT/DKIM records intact. Work on other Vercel projects is outside this task.

## Current blockers

- Source is uploaded to the public GitHub repository `mitchslandscaping/website` (initial commit `69b1eef`). Secrets and local credentials are excluded. The first Vercel test deployment passed at https://mitchs-landscaping.vercel.app/. Vercel Authentication protects All Deployments; an unauthenticated HTTP request redirects to Vercel SSO (302).
- Neon Free database `mitch-owner-auth` (project `little-forest-74320127`, region iad1) is provisioned. Owner schema initialized and verified: six tables, one owner identifier, zero registered passkeys. Neon Auth and Realtime are disabled. No administrator connection was added to the website. Restricted SQL-created role mitch_owner_runtime is configured without administrator membership. OWNER_DATABASE_URL (secret) and OWNER_SITE_ORIGIN (https://www.mitchlandscaping.com) are saved for Production. Redeploy H8gRVGbHh2avtuASeLpobv6ibL1M succeeded, and the live /owner page successfully reads the credential store and shows initial setup. Owner completed passkey enrollment and reached the authenticated editor. Content connection remains disabled pending its restricted storage design. Never use SQLite in a Vercel deployment bundle or `/tmp` as production storage.
- Fillout quote form `npD75Ti9yHus` is published and embedded in the shared quote popup. A clearly labeled test submission was saved successfully. Notifications are configured to contact@mitchlandscaping.com; inbox delivery still needs human confirmation. Optional photos allow five JPG/PNG/WebP files, 5 MB each.
- Owner publishing is disabled. Complete scoped content write credentials, backups, and a successful restore exercise before activation.
- Set the final canonical origin, verify HTTPS, and let the human owner enroll the one passkey on that origin. A localhost credential does not transfer.
- Privacy link currently has no separate notice; provide an accurate notice matching final form/storage services.
- Review placeholder projects/team portraits, factual copy, mobile layouts, and real application/quote delivery before enabling indexing.

## Deployment sequence

1. Prepare and validate source locally; exclude `.env*`, `.owner`, temporary screenshots, authentication data, and customer data.
2. Source is pushed to the company repository. Connect that repository to this Vercel workspace only.
3. Configure server-only production secrets in Vercel, with separate preview credentials. Do not paste secrets into chat or store them in Git.
4. Create a protected/noindex preview and test production services before changing live DNS.
5. Connect `mitchlandscaping.com` and redirect `www` consistently; use the exact DNS values Vercel supplies for this project. Preserve mail records.
6. Verify HTTPS, canonical URLs, the owner sign-in, contact links, form receipt/delivery, backups and restore, and unauthorized-access rejection.
7. Owner personally creates the production passkey. Activate scoped publishing only after checks pass.
8. Enable public indexing and submit the production sitemap after final functional checks.

No paid service, broad repository grant, or credential change has been made by this preparation. A protected test deployment exists. The user updated GoDaddy DNS; both custom domains show Valid Configuration and HTTPS works. Email DNS was left intact.

## Validated preparation

- Vercel import form: project `mitchs-landscaping`, Next.js preset, root `./`. Test deployment succeeded; compilation, TypeScript and page generation passed. All Deployments authentication enabled and verified.
- Production build uses the validated webpack command and Node 26.
- Real Postgres test passed: restricted role cannot create tables or change the owner identifier; concurrent enrollment accepts exactly one passkey; challenges are single-use; sessions revoke/expire; rate limits persist. The disposable container was removed afterward.
- Existing production passkey HTTP flow is tested separately with an isolated SQLite fixture.
- The free production owner database is connected and the owner setup page loads; no write token or billing change has been provisioned. Fillout stores quote submissions. Both custom domains are connected, but All Deployments remain protected; the customer launch remains pending.

## Content activation audit — October 30, 2026

- The editor currently requires a Sanity server token; none is configured, explaining the content-connection error.
- Sanity document-scoped custom roles require Enterprise according to its current roles documentation. A broad Editor token would not meet the requested storage-level isolation of Team, Portfolio, and Careers. No token was created.
- Proposed alternative awaiting user choice: move editable records to a restricted Neon content schema, keeping the existing owner UI and passkey. Media storage, private draft access, revision checks, append-only history, separate backup credentials, and restore verification must be addressed before activation.
- Existing Sanity content and all 56 media files exported to ignored local backup `backups/pre-owner-2026-10-30.tar.gz` (74,819,374 bytes; mode 0600). Archive and NDJSON parse passed; this is not yet a restore test. SHA-256: `fd2b9b228fc62b090f42445e5ee0d50239c9902bd0c3f571d682d787b022a5a3`. Includes private preview-secret documents; do not publish or commit the archive.

## Sanity removal implementation — October 30, 2026

- User approved removing Sanity entirely. Source now reads fixed configuration and preserved original media locally, with Team/Portfolio/Careers drafts and published records in restricted Neon content tables. No Sanity SDK, Studio, or runtime fetch remains.
- New uploads are resized without cropping, re-encoded to WebP with metadata removed, limited to 1 MB each and 200 MB total. Draft-only uploads require an owner session. Existing media remains bundled with the site.
- Database trigger captures each saved revision in a history table the runtime cannot modify. Runtime cannot DELETE/TRUNCATE content or alter schema. Operator backup/restore tool includes media, content, drafts, and history; restore retains newer records and existing history. Scheduled independent offsite exports remain unconfigured.
- Disposable Postgres tests passed: permissions, save conflicts, private drafts/media, publish, export/restore round trip, and exact production installer. HTTP tests passed: authenticated editor access, cross-origin rejection, invalid content/photo rejection, draft privacy, upload/publish, and closing a position.
- Production installer prepared in Vercel Query tab, NOT EXECUTED pending action-time grant confirmation. Code NOT DEPLOYED yet. Existing passkey and auth data untouched.
