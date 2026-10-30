# Mitch’s Landscaping launch

Target: Vercel in the **Mitchs Landscaping** workspace; domain stays at GoDaddy. Keep Google Workspace MX/TXT/DKIM records intact. Work on other Vercel projects is outside this task.

## Current blockers

- Source is uploaded to the public GitHub repository `mitchslandscaping/website` (initial commit `69b1eef`). Secrets and local credentials are excluded. The first Vercel test deployment passed at https://mitchs-landscaping.vercel.app/. Vercel Authentication protects All Deployments; an unauthenticated HTTP request redirects to Vercel SSO (302).
- The managed Postgres owner-auth adapter is implemented and tested against disposable Postgres with a restricted role. Provision its production database and apply the migration before enabling owner access on Vercel. Never put its SQLite file in a deployment bundle or `/tmp` as production storage.
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
- No production owner database, write token, or billing change has been provisioned. Fillout stores quote submissions. Both custom domains are connected, but All Deployments remain protected; the customer launch remains pending.
