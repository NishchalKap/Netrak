# Netrak

Netrak is an AI-powered digital public-safety intelligence platform for citizens, law-enforcement teams, financial institutions, telecom operators, and government agencies.

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

Install the dependencies in each application before the first run, then execute:

```bash
npm run lint
npm run typecheck
npm run build
```

## Operational platform architecture

The workspace uses React, TypeScript, Vite, React Router, TanStack Query, Axios, Lucide, and Recharts. It follows a feature-first boundary:

- `src/app` — application providers, routing, shell, navigation, and theming.
- `src/components` — reusable primitives and operational UI patterns.
- `src/data` — typed API repositories and query hooks.
- `src/features` — authentication and global search workflows.
- `src/lib` — API transport, formatting, GeoJSON conversion, and realtime abstractions.
- `src/pages` — route-level operational capabilities.

See [operational-platform.md](docs/architecture/operational-platform.md) for API boundaries, component behavior, and future backend integration points.

## Documentation

- [Operational platform](docs/architecture/operational-platform.md)
- [Architecture summary](docs/architecture/architecture-summary.md)
- [Frontend contract](docs/frontend-contract.md)
- [Design system](docs/design/DESIGN.md)
