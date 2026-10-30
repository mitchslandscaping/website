# Mitch’s Landscaping launch

Target: Vercel in the **Mitchs Landscaping** workspace; domain stays at GoDaddy. Keep Google Workspace MX/TXT/DKIM records intact. Work on other Vercel projects is outside this task.

## Current blockers

- GitHub repository `mitchslandscaping/website` is connected in the Vercel import screen but is still empty and public. Repository visibility and company-account source upload remain to be finalized.
- The managed Postgres owner-auth adapter is implemented and tested against disposable Postgres with a restricted role. Provision its production database and apply the migration before enabling owner access on Vercel. Never put its SQLite file in a deployment bundle or `/tmp` as production storage.
- Quote form is still a prototype: no requests or photos are delivered. Complete durable private intake and notifications, or explicitly approve a simpler working intake path before launch.
- Owner publishing is disabled. Complete scoped content write credentials, backups, and a successful restore exercise before activation.
- Set the final canonical origin, verify HTTPS, and let the human owner enroll the one passkey on that origin. A localhost credential does not transfer.
- Privacy link currently has no separate notice; provide an accurate notice matching final form/storage services.
- Review placeholder projects/team portraits, factual copy, mobile layouts, and real application/quote delivery before enabling indexing.

## Deployment sequence

1. Prepare and validate source locally; exclude `.env*`, `.owner`, temporary screenshots, authentication data, and customer data.
2. Push the website to its private repository. Connect that repository to this Vercel workspace only.
3. Configure server-only production secrets in Vercel, with separate preview credentials. Do not paste secrets into chat or store them in Git.
4. Create a protected/noindex preview and test production services before changing live DNS.
5. Connect `mitchlandscaping.com` and redirect `www` consistently; use the exact DNS values Vercel supplies for this project. Preserve mail records.
6. Verify HTTPS, canonical URLs, the owner sign-in, contact links, form receipt/delivery, backups and restore, and unauthorized-access rejection.
7. Owner personally creates the production passkey. Activate scoped publishing only after checks pass.
8. Enable public indexing and submit the production sitemap after final functional checks.

No paid service, broad repository grant, or credential change has been made by this preparation. No public deployment or DNS change has been made.

## Validated preparation

- Vercel import form: project `mitchs-landscaping`, Next.js preset, root `./`. No deployment started.
- Production build uses the validated webpack command and Node 26.
- Real Postgres test passed: restricted role cannot create tables or change the owner identifier; concurrent enrollment accepts exactly one passkey; challenges are single-use; sessions revoke/expire; rate limits persist. The disposable container was removed afterward.
- Existing production passkey HTTP flow is tested separately with an isolated SQLite fixture.
- No production database, write token, customer request store, billing change, public deployment, or DNS change has been provisioned by this preparation.
