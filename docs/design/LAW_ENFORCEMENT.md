# Netrak Law Enforcement Workspace

> Design direction document. The implemented v1.0 scope and integration limitations are defined in `docs/release-scope.md`.

## Experience promise

This is mission control: dense, fast, auditable, and calm. It uses the citizen design system but allocates more screen area to information.

## Desktop layout

- 12-column grid, fixed utility navigation, flexible work canvas.
- Global search and command entry at the top.
- Primary working area: 8 columns.
- Context/assignment rail: 4 columns.
- Maximise tables, maps, timelines, and evidence review without decorative card stacks.

## Workspace hierarchy

1. National threat index and operational time range.
2. Today’s activity and priority alerts.
3. Active incidents with ownership and SLA.
4. Threat intelligence: indicators, linked entities, source confidence.
5. Case queue and assignments.
6. Case workspace: details, timeline, evidence, notes, relationship graph.

## Operational rules

- Use data density intentionally; every column must support a decision.
- Preserve filters and position during case review.
- Evidence is immutable in presentation; amendments must remain auditable.
- Map markers use clustering and semantic status, never decorative heat-map noise.
- Keyboard navigation is first-class for queues and evidence review.

## AI assistance

AI may summarise, cluster, translate, and surface anomalies. It must show source context, confidence, and a clear path to the underlying record. It does not make enforcement decisions.
