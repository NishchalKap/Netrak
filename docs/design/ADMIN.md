# Netrak Administration

> Design direction document. Administrative mutations without gateway contracts are future scope; see `docs/release-scope.md`.

## Experience promise

Administration is restrained enterprise software: clear access boundaries, accountable change, and immediate service visibility.

## Sections

- Users and organisations.
- Roles and permissions.
- AI service status and model/version visibility.
- API and integration health.
- Audit log.
- System configuration.
- Analytics and retention controls.

## Rules

- High-risk changes require confirmation, actor identity, timestamp, and audit reason where appropriate.
- Permission interfaces use progressive disclosure: role summary first, granular grants second.
- Health dashboards use semantic severity, timestamps, and retry/status actions—not animated gauges.
- Audit records are searchable, filterable, exportable only when authorised, and displayed in mono metadata format.
- Never place destructive controls next to ordinary save actions.

## Responsive behavior

Administration is optimised for desktop and tablet. On mobile, prioritise health summaries, approvals, and read-only audit access; avoid forcing large permission matrices into a small viewport.
