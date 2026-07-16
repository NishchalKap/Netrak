# Netrak

Netrak is a digital public-safety reporting and operational-intelligence platform for citizens, law-enforcement teams, financial institutions, telecom operators, and government agencies. The v1.0 release candidate does not present experimental AI services as deployed capabilities.

See [Netrak v1.0 release scope](docs/release-scope.md) before making product or demonstration claims. It distinguishes tested capabilities, limited integrations, and future scope.

## Applications

- `apps/mobile` — the citizen-facing Expo application.
- `apps/operations` — the responsive officer, command-center, intelligence, evidence, analytics, and administration web workspace.
- `backend/gateway` — the existing Express gateway, Prisma data layer, authentication, and documented APIs.
- `shared` — shared API types and platform contracts.

The citizen application and operational workspace are intentionally separate products. The operational workspace accepts only authenticated `OFFICER` and `ADMIN` accounts; citizen accounts remain in the mobile application.

## Run the operational workspace

```bash
npm run install:operations
npm run dev:operations
```

The web workspace opens on `http://localhost:4173` and uses `http://localhost:3000/api` by default. Copy `apps/operations/.env.example` to `.env` when the gateway is hosted elsewhere.

## Run the platform checks

Install each application and execute the release quality gate:

```bash
npm run install:all
npm run verify
npm run export --prefix apps/mobile
```

Copy the relevant `.env.example` before starting services. Production deployments must supply a unique gateway JWT secret, PostgreSQL connection, and explicit HTTPS CORS origins. Never place secrets in `VITE_` or `EXPO_PUBLIC_` variables because those values are bundled into clients.

Apply the committed database migration as a separate deployment step before starting a new gateway release:

```bash
npm run prisma:migrate:deploy
```

Do not run `prisma db push` against production. Back up the target database, review the SQL migration, apply it with the deployment identity, and verify `/api/health` before shifting traffic.

## Operational platform architecture

The workspace uses React, TypeScript, Vite, React Router, TanStack Query, Axios, Lucide, and Recharts. It follows a feature-first boundary:

- `src/app` — application providers, routing, shell, navigation, and theming.
- `src/components` — reusable primitives and operational UI patterns.
- `src/data` — typed API repositories and query hooks.
- `src/features` — authentication and global search workflows.
- `src/lib` — API transport, safe formatting, and GeoJSON capability boundaries while production views use transparent polling.
- `src/pages` — route-level operational capabilities.

See [operational-platform.md](docs/architecture/operational-platform.md) for API boundaries, component behavior, and future backend integration points.

## Documentation

- [Operational platform](docs/architecture/operational-platform.md)
- [Architecture summary](docs/architecture/architecture-summary.md)
- [Frontend contract](docs/frontend-contract.md)
- [Design system](docs/design/DESIGN.md)
- [Release candidate runbook](docs/release-candidate.md)
- [Release scope and capability truth](docs/release-scope.md)
- [Security policy](SECURITY.md)
