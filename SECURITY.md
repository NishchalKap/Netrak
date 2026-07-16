# Netrak Security Policy

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in public issues, demonstrations, screenshots, or shared logs. Contact the repository maintainers privately with the affected component, reproducible steps, impact, and any safe remediation guidance. Do not include live credentials, citizen records, evidence, or production tokens.

## Supported release

Security fixes target the current release-candidate branch and the latest tagged production release. Older development snapshots are not supported.

## Deployment requirements

- Use a unique `JWT_SECRET` of at least 32 random characters and rotate it through the deployment secret manager.
- Keep `ALLOW_PRIVILEGED_REGISTRATION=false` outside an isolated demonstration environment.
- Keep `ALLOW_LEGACY_PASSWORD_MIGRATION=false`; production startup rejects it.
- Restrict `CORS_ORIGINS` to approved HTTPS origins.
- Terminate TLS at the ingress or load balancer and never expose PostgreSQL publicly.
- Deploy one gateway replica per agency trust boundary unless an approved shared rate-limit/replay layer and tenant-isolation contract are added.
- Keep API documentation disabled in production unless access is restricted at the ingress.
- Store Expo native tokens in SecureStore; web access tokens intentionally use session storage.
- Treat application logs, evidence references, case records, and identifiers as sensitive operational data.

The gateway fails startup when production uses development credentials, placeholder secrets, insecure browser origins, an insecure public API URL, or legacy-password migration.

See [release security posture](docs/security.md) for implemented controls, deployment conditions, residual limitations, and independent penetration-test scope.
