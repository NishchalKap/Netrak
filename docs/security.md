# Netrak v1.0 Release Security Posture

This document records implemented controls and known architectural boundaries. It is not a compliance certificate, penetration-test report, or claim that the software is vulnerability-free.

## Implemented controls

- JWT verification pins HS256, issuer, audience, subject, identity, role, expiry, token lifetime, and unique token ID.
- Refresh is bounded after expiry and a token fingerprint can be consumed only once by the active gateway process.
- Native tokens use device SecureStore with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`; web tokens use session storage rather than persistent local storage.
- Citizen self-registration requires a 12-character minimum password. Passwords use parameterized scrypt with random salts. Legacy plaintext comparison is disabled by default and prohibited in production.
- Missing-user login performs a dummy password derivation to reduce account-enumeration timing differences.
- Authentication endpoints and the API have bounded request-rate middleware and standard rate-limit response headers.
- Citizen case and notification reads are ownership-scoped. Citizens cannot transition official workflow status or alter/delete cases after review begins.
- Officer/admin notification creation validates the target user. Privileged self-registration is disabled by default.
- Zod schemas are strict, bounded, normalized, and reject unknown mass-assignment fields. UUID path parameters are validated before database access.
- Prisma query APIs parameterize database operations. No raw query includes user input.
- User-provided evidence references are stored only as text and are never fetched by the gateway. Operations opens only valid HTTPS references.
- The gateway accepts bounded JSON bodies only for application mutations; it has no XML parser or binary upload path.
- Helmet, explicit CORS allowlists, request IDs, sanitized error responses, no-store headers for sensitive API resources, body limits, and server timeouts are active.
- Production startup rejects development credentials, placeholder JWT secrets, wildcard or non-HTTPS browser origins, non-HTTPS public API URLs, and legacy password migration.
- Client configuration validates URL schemes, timeouts, retry counts, and polling intervals. Operations ships a restrictive baseline CSP and security-header manifest.
- Logs exclude query strings, passwords, tokens, request bodies, and recovery email addresses. Unexpected client responses receive a correlation ID without a stack trace.

## Threat-class disposition

| Threat class | Release disposition |
| --- | --- |
| SQL injection | Prisma parameterized APIs; no user-controlled raw SQL |
| Command/path injection | No user-controlled shell execution or filesystem path endpoint |
| File upload, XXE | No binary upload or XML parser exists in the release API |
| SSRF | Evidence URLs are not dereferenced server-side; browser opening is HTTPS-only |
| XSS | React escaping, no raw HTML rendering, CSP baseline, validated external links |
| CSRF | Bearer tokens are supplied in authorization headers; cookies and credentialed CORS are not used |
| Open redirect | No redirect target is accepted from API or URL input |
| Broken object access | Citizen-owned cases/evidence/notifications are checked server-side; staff access is deployment-wide by documented design |
| Brute force and replay | Process-local rate limits and single-use refresh fingerprints; distributed controls remain a deployment requirement |
| Sensitive data exposure | Secure native storage, session-only web storage, sanitized errors/logging, HTTPS required outside loopback production configuration |

## Mandatory deployment conditions

1. Deploy one isolated Netrak data plane per agency or equivalent trust boundary. The current data model has no organization/tenant field.
2. Use a managed PostgreSQL service with encryption, private networking, backups, tested restoration, least-privilege credentials, and platform audit logging.
3. Store `JWT_SECRET` and database credentials in the deployment secret manager. Use at least 32 cryptographically random bytes and define a rotation/runbook window.
4. Terminate TLS at an approved ingress, restrict CORS to exact HTTPS origins, disable public Swagger, and apply edge rate limits. Multiple gateway replicas require shared replay/rate-limit state before approval.
5. Serve the operations artifact with the supplied CSP/security headers or stricter equivalents. Narrow `connect-src` to the deployed API origin.
6. Keep reference advisories, privileged registration, and legacy password migration disabled in production.
7. Configure centralized logs with access control, retention, redaction review, alerting, and request-ID search. Do not send citizen content to unapproved analytics providers.
8. Complete database-backed integration tests, container scanning, signed native builds, backup restoration, disaster recovery, and an independent penetration test in the target environment.

## Residual architectural limitations

- The refresh design uses the existing single-token API contract. Replay memory is not durable or shared across replicas, and there is no per-device session revocation endpoint.
- Staff access is deployment-wide because organization, jurisdiction, assignment, and tenant contracts do not exist.
- Immutable audit logs, evidence hashes, binary storage, chain of custody, notification read mutation, and password-reset delivery are not implemented.
- CSP headers depend on the static host honoring `_headers`; other hosting platforms must configure equivalent headers explicitly.
- The experimental speech prototype is outside the release trust boundary and must not be deployed with v1.0.
- Expo's transitive native configuration tool currently carries the moderate `GHSA-w5hq-g745-h8pq` advisory through `xcode`/legacy `uuid`. npm's proposed forced remedy is an incompatible SDK downgrade; CI blocks high/critical advisories while this upstream moderate item is tracked.

## Independent penetration-test scope

Test the gateway, operations origin, citizen web build, native storage behavior, CORS/headers, JWT validation and replay, rate-limit bypass, object-level authorization, mass assignment, workflow transitions, evidence references, error/log leakage, dependency/container composition, and deployment configuration. Use synthetic records and dedicated accounts. Findings must be reported privately according to `SECURITY.md`.
