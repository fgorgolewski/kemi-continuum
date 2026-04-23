# Kemi Continuum — Tasks

**Brand:** Continuum — Style Stewardship by Kemissa
**Domain:** continuumbykemissa.com
**Stack:** Vite + React + TypeScript + Tailwind + shadcn/ui + Supabase
**Deploy:** Cloudflare Pages from `main` branch of this repo
**Collaborators:** Kemissa (owner), Dila (?), Filip (tech + advisor)
**Started tracking:** 2026-04-20

---

## P1 — Active

- [ ] [K001] 🤖 **P3** Confirm current scope with Kemissa — what needs to ship first (landing, shop, blog, editorial, something else)?
- [ ] [K002] 🤝 **P3** Audit current site copy (`website-copy.docx`) — verify what's live vs. placeholder, list what still needs brand voice pass
- [ ] [K003] 🤝 **P3** Email routing — configure remaining 4 addresses (support@, dila@, hello@, donotreply@) for continuumbykemissa.com. kemissa@ already done → kr@kemissa.com.
- [ ] [K013] 🔥 **P1** Fix bounce on kemissa@continuumbykemissa.com — emails sent there return to sender with error (2026-04-23). DNS is OK (MX → Cloudflare Email Routing, SPF present). Likely causes: (a) destination `kr@kemissa.com` not Verified in Cloudflare Email Routing, or (b) kemissa.com itself has no MX / rejects mail. Check: Dashboard → continuumbykemissa.com → Email → Email Routing → Destination addresses. Also consider switching destination to a Gmail address that definitely accepts mail.
- [ ] [K014] 🤝 **P2** After K013 is fixed — verify hello@continuumbykemissa.com is active and forwards correctly (site footer now uses hello@, not kemissa@).
- [ ] [K015] 🤝 **P1** 2026-04-24 — verify new site is live on continuumbykemissa.com after Cloudflare Pages deploy of commit 4abe65d. Check: (1) Hero tagline reads "A private style practice for men with a life to run.", (2) Practice section shows "Thought through. Taken care of." + Direction/Discretion/Continuity + Client Cap 5, (3) Phase I/II/III descriptions match new copy, (4) /about route shows Kemissa bio ("Some things are inherited..."), (5) /practice route exists, (6) no INQUIRY link in nav, (7) footer reads "For referred enquiries — hello@continuumbykemissa.com", (8) /contact returns 404 (expected). Test on desktop + mobile.

## P2 — After P1 alignment

- [ ] [K004] 🤝 **P3** Design system doc — pull current Tailwind theme into `DESIGN.md` so changes can be reasoned about before making them
- [ ] [K005] 🤝 **P3** Supabase schema audit — confirm what's in `supabase/` folder, what tables exist, what the data model supports
- [ ] [K006] 🤖 **P3** Deployment runbook — `npm run build` + `wrangler pages deploy dist/` if that's the flow, document env vars, domain config
- [ ] [K007] 🤝 **P3** DILA_SETUP.md review — what's Dila's role, what does she need access to, is onboarding complete?

## P3 — Backlog

- [ ] [K008] 🤝 **P3** Analytics — PostHog or Plausible snippet (pattern proven on filipgorgo.com)
- [ ] [K009] 🤝 **P3** OG meta + Twitter Card per page (pattern from filipgorgo.com)
- [ ] [K010] 🤝 **P3** Performance audit — Lighthouse + Core Web Vitals baseline
- [ ] [K011] 🤝 **P3** Content calendar / editorial cadence if there's a blog component
- [ ] [K012] 🤝 **P3** Payment integration if there's a shop component (Stripe, same pattern as filipgorgo.com)
