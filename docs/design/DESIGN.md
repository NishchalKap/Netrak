# Netrak Design System

> Design reference, not a release capability checklist. See `docs/release-scope.md` for implemented v1.0 behavior.

## Purpose

Netrak is digital public-safety intelligence. The interface must lower anxiety, establish institutional trust, and make consequential work feel clear. It is not a cybersecurity spectacle.

## Product character

- Quietly premium, never decorative.
- Operational when used by professionals; reassuring when used by citizens.
- Editorial hierarchy over dashboard clutter.
- One brand accent: cyan. Semantic colours communicate state only.
- Motion confirms actions; it never seeks attention.

## Non-negotiables

- No neon, gradients, glow, terminal UI, matrix patterns, faux code, or floating visual effects.
- No rainbow charts.
- No monospace display typography.
- No component used solely as decoration.
- No raw backend errors in product UI.

## Color tokens

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| Background | `#09090B` | `#F7F8FA` | Page canvas |
| Surface | `#111217` | `#FFFFFF` | Cards and navigation |
| Elevated | `#17181D` | `#EFF2F5` | Inputs and selected surfaces |
| Text | `#F5F5F5` | `#14161A` | Primary text |
| Muted | `#9EA3AE` | `#626976` | Supporting text |
| Border | `rgba(255,255,255,.08)` | `rgba(20,22,26,.10)` | Hairline division |
| Accent | `#00C2FF` | `#009BCB` | Focus, primary signal |
| Success | `#22C55E` | `#16803D` | Positive state |
| Warning | `#F59E0B` | `#B86E00` | Caution |
| Danger | `#EF4444` | `#BE3434` | Urgent action |

## Typography

Use General Sans or Satoshi for display hierarchy; use Inter for all interface/body text. Use JetBrains Mono only for case IDs, timestamps, hashes, transaction identifiers, and machine metadata.

| Role | Mobile size / line | Desktop size / line | Weight |
| --- | --- | --- | --- |
| Display | 40 / 45 | 64 / 70 | 800 |
| H1 | 34 / 40 | 48 / 56 | 800 |
| H2 | 24 / 30 | 32 / 40 | 700 |
| H3 | 18 / 24 | 20 / 28 | 700 |
| Body | 16 / 24 | 16 / 24 | 400 |
| Label | 10–12 / 16 | 11–12 / 16 | 700–800 |
| Metadata | 12 / 18 | 12 / 18 | 500 Mono |

## Spatial system

Base unit: 4px. Use 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Citizen screens favour 20px horizontal padding and 28–40px section intervals. Professional screens use a 12-column desktop grid and compact 12–20px interior gaps.

## Responsive behavior

- Mobile: single column, sticky primary action only when it meaningfully reduces risk.
- Tablet: two-column content only when both columns remain readable at 320px or more.
- Desktop: content max-width 1440px; 12-column grid; never stretch paragraphs beyond 70 characters.
- Respect safe areas, dynamic text sizing, keyboard appearance, and reduced motion.

## Motion

Buttons: 120ms. Cards: 180ms. Page transition: 250ms. Charts: 400ms. Use ease-out; no bounce or spring. Motion must be optional under reduced-motion settings.

## Accessibility

- Every touch target is at least 44 × 44px.
- Use visible keyboard focus, semantic roles, labels, and state announcements.
- Never encode severity with colour alone.
- Maintain AA contrast or better.
- Present timestamps in local time with a machine-readable ISO value where needed.

## Theme behavior

Dark is the default experience. The user can change appearance from the landing control or Settings. Appearance is a product preference, not a security state; messaging must never imply that dark mode is safer.
