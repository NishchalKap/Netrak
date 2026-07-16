# Netrak Implementation and Cleanup Plan

> Status: historical roadmap. Items below are not release claims. The authoritative implementation status is maintained in `docs/release-scope.md`.

## Objective

Turn the repository into a clear product workspace that separates research, architecture, application code, backend services, and shared contracts. The cleanup will preserve the strategy documents while making the implementation path explicit and maintainable.

## 1. Repository Structure

The repository should be organized as follows:

- docs/
  - research/ for the source research and market/threat documents
  - architecture/ for architecture and implementation planning documents
- apps/
  - mobile/ for the Expo-based client application
- backend/
  - services/ for API, auth, case management, and alerting
  - ai/ for fraud, counterfeit, and geospatial intelligence services
- shared/
  - types/ for domain models and API contracts
  - utils/ for reusable helpers

## 2. What to Keep and What to Move

### Keep at the root
- README.md
- LICENSE
- package and environment configuration files if they are still required by the app

### Move into docs
- AI_Digital_Public_Safety_Blueprint.md
- AI_Digital_Public_Safety_System_Architecture.md
- Digital_Public_Safety_Market_Intelligence_Report.md
- Digital_Public_Safety_Threat_Intelligence_Report.docx

### Move into apps/mobile
- The existing Expo application code that currently sits under the scratch project path
- All mobile-specific screens, components, stores, hooks, and assets

### Create for backend and shared code
- backend/services for server-side orchestration
- backend/ai for model and inference service boundaries
- shared/types for the domain objects shared by mobile and backend

## 3. Cleanup Rules

1. Remove or archive duplicate and temporary files.
2. Keep only one canonical implementation of each feature.
3. Avoid mixing research documents with runtime source code.
4. Use descriptive folder names and consistent naming conventions.
5. Keep configuration and environment files minimal and explicit.

## 4. Implementation Phases

### Phase 0 — Repository Foundation
- Create the final folder structure.
- Move planning docs into docs/.
- Replace the root README with a short project overview and navigation guide.
- Add a single architecture entry point for future contributors.

### Phase 1 — Mobile App Cleanup
- Normalize the Expo app folder.
- Group screens by feature domain.
- Consolidate shared UI components under a clear components path.
- Remove unused starter assets and dead code.

### Phase 2 — Core Product Modules
- Implement the citizen fraud shield flows.
- Build the dashboard and case management shell.
- Add the alerting and routing entry points.
- Keep the app wired to a clean API contract layer.

### Phase 3 — Backend Foundation
- Create the API gateway and auth boundary.
- Add service modules for case management and alerts.
- Create placeholders for fraud scoring, graph intelligence, and counterfeit detection services.

### Phase 4 — Data and AI Integration
- Define the shared models for alerts, cases, risk verdicts, and evidence.
- Add the persistence and storage layer.
- Integrate the AI services behind a clean interface.

## 5. Quality Gates

- TypeScript strict mode for app and shared code
- Consistent linting and formatting
- Clear folder ownership and naming
- README and architecture docs updated with every major milestone
- No new feature should be added without a matching documentation update

## 6. Proposed Delivery Order

1. Clean repository structure
2. Stabilize the mobile app shell
3. Add backend skeleton and shared contracts
4. Implement the core user workflows
5. Integrate AI and threat intelligence services
6. Add testing, telemetry, and deployment scaffolding
