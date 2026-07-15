# Netrak Security Policy

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in public issues, demonstrations, screenshots, or shared logs. Contact the repository maintainers privately with the affected component, reproducible steps, impact, and any safe remediation guidance. Do not include live credentials, citizen records, evidence, or production tokens.

## Supported release

Security fixes target the current release-candidate branch and the latest tagged production release. Older development snapshots are not supported.

## Deployment requirements

- Use a unique `JWT_SECRET` of at least 32 random characters and rotate it through the deployment secret manager.
- Keep `ALLOW_PRIVILEGED_REGISTRATION=false` outside an isolated demonstration environment.
- Restrict `CORS_ORIGINS` to approved HTTPS origins.
- Terminate TLS at the ingress or load balancer and never expose PostgreSQL publicly.
- Keep Supabase service-role credentials server-side only.
- Store Expo native tokens in SecureStore; web access tokens intentionally use session storage.
- Treat application logs, evidence references, case records, and identifiers as sensitive operational data.

The gateway fails startup when production uses development credentials or wildcard browser origins.
