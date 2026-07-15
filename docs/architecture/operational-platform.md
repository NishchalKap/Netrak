# Operational Platform Architecture

## Scope

`apps/operations` extends Netrak with an authenticated law-enforcement and administration workspace while preserving the existing citizen Expo application and all backend contracts.

Implemented routes:

| Route | Capability |
| --- | --- |
| `/` | Officer dashboard and priority queue |
| `/cases` | Searchable, filterable, sortable, paginated case queue |
| `/cases/:id` | Investigation workspace, status control, evidence references, timeline, and related intelligence |
| `/command` | Command-center aggregates, regional advisory distribution, alerts, and service health |
| `/intelligence` | Threat feed, severity filters, regional context, indicators, detail, and cached offline intelligence |
| `/evidence` | Cross-case evidence metadata search, filters, pagination, and safe reference preview |
| `/timeline` | Unified case, evidence, threat, and notification chronology |
| `/analytics` | Time-bounded case, workflow, risk, evidence, and threat aggregations |
| `/maps` | GeoJSON-ready incident geography with honest no-coordinate behavior |
| `/notifications` | Notification service feed and read-state filtering |
| `/profile` | Existing profile read/update API |
| `/admin` | Administrator-only health overview and documented capability boundaries |

## API consumption

The repository layer consumes only existing gateway routes:

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/profile`
- `PATCH /auth/profile`
- `GET /cases`
- `POST /cases`
- `GET /cases/:id`
- `PATCH /cases/:id`
- `DELETE /cases/:id`
- `POST /cases/:id/evidence`
- `GET /threats`
- `GET /threats/:id`
- `GET /notifications`
- `GET /health`

Axios request interceptors attach the stored JWT. A single refresh promise prevents concurrent refresh storms. Only idempotent requests are retried after transient network/server failures. TanStack Query provides caching, refetching, request state, and a visible 60-second polling model. Threat intelligence maintains a last-known-good browser cache for offline read access; case mutations are never queued or simulated offline.

## Reusable components

The component layer includes buttons, cards, page and section headers, badges and risk indicators, metrics, fields, search controls, data tables, pagination, dialogs, skeletons, empty states, error states, capability notices, timelines, evidence cards, notification feeds, charts, drawers, and responsive navigation.

Every visual value is tokenized in `src/styles/global.css`. Dark mode is the default; light mode is persisted locally. Focus visibility, reduced-motion preferences, semantic landmarks, accessible labels, minimum input sizes, responsive navigation, and mobile bottom-sheet dialogs are included.

## Capability boundaries

Swagger does not currently expose contracts for users, assignments, officer notes, organizations, roles, audit logs, notification read mutations, chain of custody, evidence file binaries, GIS coordinates, or realtime streams. The frontend does not invent endpoints or persist unofficial operational data. Instead:

- administrative controls explain which contract is missing;
- assignment, notes, and chain-of-custody panels are read-only notices;
- geospatial components consume a typed future GeoJSON boundary and render no guessed coordinates;
- realtime transport is an unconfigured typed abstraction while views use transparent polling;
- related intelligence is labeled as deterministic keyword correlation, not AI analysis.

These boundaries allow backend capabilities to be added without redesigning the officer experience or misleading operators today.
