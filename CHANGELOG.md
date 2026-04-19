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
