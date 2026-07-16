# Architecture Summary

> Status: product-direction document. AI scoring, counterfeit verification, graph intelligence and geospatial prediction are future architecture, not active v1.0 capabilities. See `docs/release-scope.md` for implemented release behavior.

## Product direction

Netrak should be built as a layered platform with:

- a citizen-facing mobile experience
- a law-enforcement and admin operations layer
- backend services for case management, alerts, and routing
- AI services for fraud scoring, counterfeit verification, and geospatial intelligence
- shared data contracts and evidence handling

## Priority modules

1. Citizen fraud shield and reporting flows
2. Alert routing and case management
3. Counterfeit currency verification
4. Fraud-network and threat-intelligence analytics
5. Evidence generation and auditability

## Design principles

- Keep research documents separate from implementation code.
- Use a modular service boundary instead of a single monolith from the start.
- Prefer clear contracts and typed interfaces over ad-hoc integration.
- Build for explainability and auditability because the platform deals with public safety and legal evidence.
