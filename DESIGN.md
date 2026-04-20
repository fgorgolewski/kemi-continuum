# Design System — Kemissa Continuum

## Product Context
- **What this is:** Luxury personal styling and wardrobe consultancy
- **Who it's for:** High-net-worth professionals who value craft, discretion, and the power of a considered appearance
- **Space/industry:** Luxury fashion advisory, wardrobe management, personal styling
- **Project type:** Dual-surface — marketing site (kemissa.com) + ops dashboard (admin.kemissa.com)

## Aesthetic Direction
- **Direction:** Luxury/Refined with editorial restraint
- **Decoration level:** Intentional — no ornament for its own sake, warmth through color temperature and typography
- **Mood:** A beautifully designed art catalogue. Every element earns its place. Quiet confidence, not performance.
- **Reference sites:** Agency de la Mode, Stateless NYC, Net-a-Porter editorial

## Typography
- **Display/Hero:** Instrument Serif — warm contemporary serif with subtle calligraphic energy. Not as cold as Didot, not as expected as Playfair. Used for all headings, page titles, hero text.
- **Body:** DM Sans — clean, excellent readability at all sizes. Handles UI labels, body copy, navigation, and form text.
- **UI/Labels:** DM Sans (same as body) — weight 500 for labels, weight 400 for body
- **Data/Tables:** Geist Mono — tabular-nums, clean for financial data, tracking numbers, timestamps, and dashboard metrics
- **Code:** Geist Mono
- **Loading:** Google Fonts CDN
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=Geist+Mono:wght@300;400;500&display=swap" rel="stylesheet">
  ```
- **Scale (rem, 16px base):**
  - Display: 4.5rem (72px) — hero headings
  - H1: 2.25rem (36px) — page titles
  - H2: 2rem (32px) — section headings
  - H3: 1.5rem (24px) — subsections
  - Body: 1rem (16px) — primary text
  - Small: 0.8125rem (13px) — captions, labels
  - Micro: 0.6875rem (11px) — uppercase tracking labels
  - Data: 0.875rem (14px) — table cells, monospace

## Color

- **Approach:** Restrained — black/white does the heavy lifting, stone is the only accent
- **Foreground:** #0A0A0A — near-black, softer than pure #000
- **Background:** #FFFFFF — pure white (light mode)
- **Surface:** #FAF9F7 — warm off-white for cards, sidebar, elevated areas
- **Surface 2:** #F5F3F0 — slightly deeper warm surface
- **Stone (accent):** #9C8E7C — warm taupe, the brand's signature warmth
- **Stone light:** #C4B9AB — hover states, subtle highlights
- **Stone dark:** #7A6F62 — pressed states, emphasis
- **Muted text:** #8A8279 — warm gray for secondary text (not cold #6B7280)
- **Border:** #E8E4DF — warm border, not cold #E5E7EB
- **Border subtle:** #F0EDE9 — table row dividers, inner borders
- **Semantic:**
  - Success: #5C8A5E (muted forest)
  - Warning: #B8944A (warm amber)
  - Error: #B85454 (muted red)
  - Info: #5C7A8A (cool slate)
- **Dark mode strategy:**
  - Background: #0A0A0A
  - Surface: #141210 (warm dark, not cold #111)
  - Surface 2: #1C1A17
  - Borders: #2A2622 (warm dark border)
  - Stone shifts lighter for readability: #B8A898
  - Semantic backgrounds darken to 10-15% saturation: success #1A2A1A, warning #2A2518, error #2A1A1A

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — marketing site breathes, dashboard is tighter but never cramped
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64)
- **Section padding:** 80px (marketing), 32px (dashboard)
- **Component internal padding:** 12-16px (inputs, cards), 10-24px (buttons)

## Layout
- **Approach:** Hybrid — editorial composition for marketing, disciplined grid for ops dashboard
- **Marketing grid:** Asymmetric, photography-led, generous whitespace, Instrument Serif as focal point
- **Dashboard grid:** `grid-cols-[14rem_1fr]` sidebar + main, max content naturally bounded
- **Max content width:** 1100px (marketing), unconstrained with max-w-5xl for dashboard content
- **Border radius:**
  - sm: 4px — inputs, buttons, small elements
  - md: 8px — cards, tables, containers
  - lg: 12px — modals, dashboard panels
  - full: 9999px — badges, pills

## Motion
- **Approach:** Intentional — transitions aid comprehension and add warmth, never decorative
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — the signature Kemissa curve. Smooth, decisive, no bounce.
- **Duration:**
  - Micro: 50-100ms (button press, checkbox)
  - Short: 150-250ms (hover states, focus rings)
  - Medium: 300ms (sidebar expand, dialog open, nav cascade)
  - Long: 600-1200ms (page reveal, hero entrance)
- **Patterns:**
  - Cascade: children stagger 40ms apart, slide from left with fade
  - Reveal: translateY(8px) → 0 with opacity, 1.2s, eased
  - Height transition: max-height + opacity for expand/collapse
- **Rules:**
  - No spring/bounce physics
  - No scale transforms on text
  - Prefer opacity + translate over scale
  - `prefers-reduced-motion` disables all non-essential animation

## Dashboard-Specific Rules
- Sidebar nav uses uppercase tracking labels (9px, 0.15-0.2em) for section headers
- Active nav items get `bg-muted` highlight (warm surface, not cold gray)
- Table headers: 10px uppercase, 0.15em tracking, muted color
- Data cells use Geist Mono at 13px with tabular-nums
- All table borders use `border-subtle` (#F0EDE9), not full border color
- Phase/status badges use the semantic color system, not arbitrary colors
- Stone accent used for: Dila branding, section headers, active accent states

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-20 | Initial design system created | Created by /design-consultation. Competitive research across luxury styling brands (Curated by Drew, Agency de la Mode, Stateless NYC, We Are Coco). |
| 2026-04-20 | Instrument Serif over Didot/Playfair | Contemporary warmth over cold luxury or expected editorial. More genuine character for a personal service brand. |
| 2026-04-20 | Stone #9C8E7C as sole accent | Warm over cold. Signals personal care over corporate distance. Every luxury brand does silver/blue — stone gives Kemissa its own face. |
| 2026-04-20 | Warm gray scale throughout | Pure gray reads as generic SaaS. Warm grays (#FAF9F7 surfaces, #8A8279 muted text, #E8E4DF borders) make the dashboard feel like an extension of the brand. |
