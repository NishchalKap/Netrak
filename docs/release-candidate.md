# Netrak v1.0 Release Candidate

## Quality gate

From the repository root, run:

```bash
npm install
npm run verify
npm run export --prefix apps/mobile
```

The release-candidate workflow independently validates the gateway, operations workspace, Expo exports, production dependency audit, Prisma schema, and gateway container build.

## Required production configuration

Copy each application `.env.example` into the deployment secret/configuration system. Do not commit populated `.env` files.

- Gateway: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, issuer/audience, proxy and API-doc controls.
- Operations: `VITE_API_URL`, timeout, and polling interval. All `VITE_` values are public at build time.
- Expo: `EXPO_PUBLIC_API_URL`, timeout, and retries. All `EXPO_PUBLIC_` values are bundled and must never contain secrets.

`API_DOCS_ENABLED` defaults off in production. `ALLOW_PRIVILEGED_REGISTRATION` must remain false; officer and administrator identities must be provisioned through the deployment's controlled process.

## Deployment

Build the gateway container from `backend/gateway/Dockerfile`. The image runs as the unprivileged Node user and exposes a liveness check at `/health`. Readiness, including database connectivity, is available at `/api/health`.

The operations artifact is `apps/operations/dist`. Expo export artifacts are generated under `apps/mobile/dist`; signed store binaries still require the organization's EAS credentials, signing keys, bundle identifiers, and store profiles, which are intentionally not stored in this repository.

## Observability integration points

The gateway emits structured JSON logs in production with request correlation IDs and sanitized request paths. Ingress and platform collectors can forward stdout to OpenTelemetry-compatible infrastructure. Sentry, Crashlytics, and analytics credentials are intentionally not fabricated; connect them through an approved deployment-specific adapter and secret manager.

## Release limitations

- Automated coverage currently protects gateway validation, JWT, and role authorization contracts. Full API integration tests require an ephemeral PostgreSQL service and seeded role fixtures.
- Native Android and iOS signed builds require external EAS/store credentials. CI validates their JavaScript and asset exports.
- Password-reset delivery depends on deployment-specific identity/email infrastructure; the public response remains enumeration-safe.
- Expo's native build toolchain currently reports 11 moderate `uuid` advisories through `xcode`/Expo config packages. No high or critical advisory is present, and npm's proposed forced remedy is a breaking Expo downgrade; track the upstream Expo dependency update rather than applying `npm audit fix --force`.
