# Changelog

A running log of changes to this repository. Two contributors work here — always `git pull` before starting and add an entry here before pushing.

## How to use this log

- Append a new entry at the top when you push.
- Use the date (YYYY-MM-DD), your name, and a short summary.
- List files or sections touched so the other contributor can spot overlaps before editing.
- If a change is in progress (uncommitted), note it under "In progress" so the other contributor knows not to touch those files.

## In progress

_None._

## Log

### 2026-04-19 — Val
**Ops dashboard scaffold (hostname-gated, Supabase auth, Clients CRUD)**

Week 1 foundation per `Ops Dashboard Build/build_plan.md`. No changes
to marketing components — Hero, Services, About, Contact, Navigation
and their pages are untouched.

- **Hostname gating in `src/App.tsx`.** `isOpsHost()` reads
  `window.location.hostname`. `ops.` subdomain serves the ops tree;
  apex serves marketing. On localhost, append `?ops=1` to hit the
  ops tree. The two trees do not share routes — the other returns
  404 for any path.
- **Supabase client** at `src/lib/supabase.ts`. Throws at import if
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing.
  `.env.example` added.
- **Auth context** at `src/providers/AuthProvider.tsx`; route guard
  at `src/components/ops/RequireAuth.tsx`. Unauthed users on `/ops/*`
  redirect to `/ops/login` with return-path in location state.
- **`/ops/login`** — magic-link only. Single email input, "Send link"
  button. No sign-up. Redirects back to the original route after
  auth. Access is further narrowed by RLS (`public.is_ops_member()`
  in schema v2) — non-allowlisted emails authenticate but see empty
  lists.
- **OpsLayout** at `src/layouts/OpsLayout.tsx`. Left sidebar + top
  bar. Nav: Today / Clients / Annual Map / Wardrobe Ops / Welcome
  Packages / Collaborators / Intensives / Financials. Initials
  derived from email; sign-out in the top-right.
- **Clients CRUD** (`src/pages/ops/Clients.tsx`) — first working
  surface. List with phase + in-phase days. Dialog form for
  create/edit. Fields: full_name, short_name, industry, phase,
  referral_source, transition_context, intake_notes, no_go_list
  (tag input). 5-client cap enforced in UI (disabled "New client"
  at cap + toast on attempt) and in the DB (trigger in schema v2).
  Sizing/preferences JSON editors deferred to a follow-up.
- **Client detail** (`src/pages/ops/ClientDetail.tsx`) with tabs:
  Profile (implemented), Annual Map / Wardrobe / Decisions /
  Communications / Documents / Welcome / Intensives (placeholder
  panels).
- **Stub pages** for the remaining sidebar items —
  `src/pages/ops/Stubs.tsx`. Each renders the surface title plus a
  one-line note about when it lands. No fake data, no Lorem Ipsum.
- **Query hooks** at `src/hooks/queries/useClients.ts` — list, by-id,
  create, update, archive, and a cap helper (`useActiveClientCount`).
- **Types** at `src/types/database.ts` — hand-authored mirror of
  `supabase_schema_v2.sql`. Regenerate with `supabase gen types` once
  the CLI is wired.
- **Schemas** at `src/lib/schemas.ts` — zod form schema, labels, and
  the `CLIENT_CAP = 5` constant.
- **Dep added**: `@supabase/supabase-js@^2.45.0`. Run `npm install`
  after pulling. No build config changes.

**Voice:** no banned vocabulary anywhere in UI strings. Headers are
functional ("Today", "Clients", not "Command Center" or "Roster").
No exclamation points. No emoji.

**Action required before merge:**
- Paste `supabase_schema_v2.sql` into the Supabase SQL editor and run
  the sanity checks at the bottom.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Cloudflare
  Workers env vars (production + preview).
- Invite `kemissa.racine@gmail.com`, `fgorgolewski@gmail.com`,
  `val.adrien@gmail.com` in Supabase Auth.
- Confirm `public.is_ops_member()` returns `true` for each operator.

### 2026-04-19 — Filip
**Standardize on npm; delete bun lockfiles**

- Removed `bun.lock` and `bun.lockb`. Cloudflare Pages was picking up bun and failing on `--frozen-lockfile`. Repo now uses npm only (via `package-lock.json`).
- If you prefer bun locally, regenerate the lock after pulling, but don't commit it unless we flip the deploy to bun.

### 2026-04-19 — Filip
**Upgrade Vite 5 → 6**

- Vite bumped to `^6.4.2` (was `^5.4.19`). Cloudflare Pages' Vite framework preset requires Vite 6+.
- No code changes needed. Build verified: 1.6s, same bundle (329KB JS / 11KB gzip CSS). Lockfiles regenerated (npm + bun).

### 2026-04-19 — Filip
**Strip Lovable-specific tooling**

- Removed `lovable-tagger` (dev-only Vite plugin) from `package.json`, `vite.config.ts`, `package-lock.json`, and `bun.lock`. Build verified clean.
- Rewrote `README.md` to document the Cloudflare Pages deploy and drop all Lovable references. Repo is now independent of Lovable.

### 2026-04-19 — Filip
**Domain + deploy prep**

- Replaced placeholder email with `kemissa@continuumbykemissa.com` in both Contact files and the copy docx.
- Updated `index.html` OG and Twitter image URLs to `https://continuumbykemissa.com/og.jpg` and added `og:url`. Removed the leftover `twitter:site "@lovable_dev"` tag.
- **Action required:** drop a `public/og.jpg` social-share image (1200×630 recommended) before deploying, or social previews will 404.

### 2026-04-19 — Filip
**Spelling + contact form**

- Switched "Enquiry / Enquiries" → "Inquiry / Inquiries" site-wide: nav label (`src/components/Navigation.tsx`), Contact eyebrow + body (`src/components/Contact.tsx`, `src/pages/Contact.tsx`), and copy docx (`website-copy.docx`).
- Added an inquiry form to the Contact section (component + page). Fields: Name, Email, Referred By, Message. Submit opens the user's mail client prefilled to `kemissa@continuum.practice`; a toast confirms the message is prepared. No backend required.
- Consolidated Contact right column — email block moved above the body paragraph; form now occupies the right column.

### 2026-04-19 — Filip
**Grammar pass on site copy**

- Phase III description: "exceed" → "exceeds" (singular verb agrees with compound subject joined by "or"). `src/components/Services.tsx`, `src/pages/Services.tsx`.
- Phase II description: "oversight of wardrobe" → "oversight of the wardrobe" (article added for parallel with "maintenance of the digital wardrobe" in same list). `src/components/Services.tsx`, `src/pages/Services.tsx`.
- About body: "think through presentation independently" → "think through their presentation independently" (possessive added; matches brand-doc phrasing). `src/components/About.tsx`, `src/pages/About.tsx`.

### 2026-04-19 — Filip
**Commit:** `b9a299f` — Rewrite site copy to Continuum brand voice

- Applied Continuum brand voice across all site copy (ARCH STUDIO placeholder removed).
- `index.html`: page title, meta description, Open Graph tags.
- `src/components/Navigation.tsx`: wordmark → CONTINUUM; labels → ENGAGEMENT / PRACTICE / ENQUIRY. Routes unchanged (`/services`, `/about`, `/contact`).
- `src/components/Hero.tsx`: headline → STYLE / STEWARDSHIP; added "by Kemissa" signature; new subheadline.
- `src/components/Services.tsx` + `src/pages/Services.tsx`: four generic services replaced with Phase I (Initial Engagement) / Phase II (Retainer) / Layer III (Intensives).
- `src/components/About.tsx` + `src/pages/About.tsx`: rewritten around "Advisory, not execution"; pillars → Judgment / Discretion / Continuity; stats → Client Cap (4–5) + Referral only.
- `src/components/Contact.tsx` + `src/pages/Contact.tsx`: rewritten as "By referral"; single email; phone, studio address, and social links removed per brand mandate (no public-facing sales surface).
- `src/pages/NotFound.tsx`: 404 message revised to voice.
- `src/index.css`: design-system header comment renamed.
- Added `website-copy.docx` as editable copy source of truth.

### 2026-04-19 — Filip
**Commit:** `b9a299f` (same push)

- Added `website-copy.docx` — source of truth for all site copy. Edit here first, then propagate to components.
