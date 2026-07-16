# Netrak Components

> Design reference, not a release capability checklist. See `docs/release-scope.md` for implemented v1.0 behavior.

## Principles

Components are calm, direct, and consistent. Use one visual emphasis per region. A component earns elevation only when it groups a decision or changes hierarchy.

## Button

- Primary: high-contrast filled surface; one primary action per view.
- Secondary: elevated surface with a border.
- Tertiary: text or icon action for low-risk navigation.
- Danger: muted red only for an irreversible or emergency decision.
- Minimum height 48px; icon/text gap 8px; radius 14–16px.
- Loading preserves the button’s width and label context.

## Input

- Uppercase 10–12px label, then a clear input surface.
- Validation appears after interaction, next to the relevant field.
- Explain constraints before submit where possible.
- Do not use placeholder text as a label.

## Card

- Surface fill with hairline border, 20px radius, and 18–20px padding on mobile.
- A card represents a discrete object, decision, or status grouping.
- Avoid card-inside-card nesting except for evidence galleries.

## Status and risk

- Status pills contain text plus semantic colour.
- Critical requires an explicit action or escalation route.
- “Low” is reassuring but never absolute; pair it with a plain-language advisory.

## Lists

- Use a strong title, a single supporting line, a metadata row, and one status element.
- Lists must support skeleton, empty, offline, error, and loaded states.
- Display case IDs and timestamps in mono only.

## Dialogs and sheets

- Dialog: confirmation, destructive action, or an interrupting legal/safety choice.
- Bottom sheet: short mobile selection list or contextual action menu.
- Never place a multi-step form in a dialog.

## Charts

- Use cyan for selected series and semantic colours only for alerts.
- Prefer labels over legends, and direct values over decorative axes.
- Provide accessible text summaries and no-data states.

## Skeletons

- Mirror final geometry; use subdued surface contrast.
- Do not use persistent spinners for content regions.

## Empty and error states

- Empty: one restrained icon, title, explanation, optional next step.
- Error: human sentence, retry action, and no opaque backend payload.
- Offline: state what is available locally and what will retry.
