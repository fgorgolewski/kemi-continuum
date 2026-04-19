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
