# Netrak v1.0 Release Candidate

## Quality gate

From the repository root, run:

```bash
npm install
npm run verify
npm run export --prefix apps/mobile
```

The Prisma validation task supplies a non-routable validation-only database URL when `DATABASE_URL` is absent. It validates schema configuration without connecting to a database; application startup and migrations still require a real deployment-owned PostgreSQL URL.

The release-candidate workflow independently validates the gateway, operations workspace, Expo exports, production dependency audit, Prisma schema and migration, PostgreSQL-backed ownership/workflow contracts, and gateway container build.

## Required production configuration

Copy each application `.env.example` into the deployment secret/configuration system. Do not commit populated `.env` files.

Apply `npm run prisma:migrate:deploy` as a controlled pre-start deployment job. Do not make application containers mutate the schema automatically on boot.

- Gateway: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, issuer/audience, proxy and API-doc controls.
- Operations: `VITE_API_URL`, timeout, and polling interval. All `VITE_` values are public at build time.
- Expo: `EXPO_PUBLIC_API_URL`, timeout, and retries. All `EXPO_PUBLIC_` values are bundled and must never contain secrets.

`API_DOCS_ENABLED` defaults off in production. `ALLOW_PRIVILEGED_REGISTRATION` must remain false; officer and administrator identities must be provisioned through the deployment's controlled process.
`LOAD_REFERENCE_ADVISORIES` must remain false when the threat table is populated from an authoritative operational source.

## Deployment

Build the gateway container from `backend/gateway/Dockerfile`. The image runs as the unprivileged Node user and exposes a liveness check at `/health`. Readiness, including database connectivity, is available at `/api/health`.

The operations artifact is `apps/operations/dist`. Expo export artifacts are generated under `apps/mobile/dist`; signed store binaries still require the organization's EAS credentials, signing keys, bundle identifiers, and store profiles, which are intentionally not stored in this repository.

## Observability integration points

The gateway emits structured JSON logs in production with request correlation IDs and sanitized request paths. Ingress and platform collectors can forward stdout to OpenTelemetry-compatible infrastructure. Sentry, Crashlytics, and analytics credentials are intentionally not fabricated; connect them through an approved deployment-specific adapter and secret manager.

## Release limitations

- Automated coverage protects gateway validation, JWT, replay, rate-limit, role authorization, ownership, evidence, notification, persisted timeline, geospatial-safety, and external-reference contracts. GitHub Actions runs the database contracts against an ephemeral PostgreSQL service.
- Native Android and iOS signed builds require external EAS/store credentials. CI validates their JavaScript and asset exports.
- Password-reset delivery is future scope. The reserved endpoint returns an enumeration-safe `503` rather than claiming that an email was queued.
- The 16 July 2026 registry audit reports 11 moderate instances of `GHSA-w5hq-g745-h8pq` through Expo's transitive `xcode` configuration tool and `uuid <11.1.1`. npm offers only `--force`, which would downgrade `expo-splash-screen` to SDK 55 and break the SDK 57 application. No high or critical advisory is reported. The release workflow reruns production dependency audits and must pass the high-severity threshold; track the upstream Expo fix rather than forcing the breaking downgrade.
