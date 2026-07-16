# Netrak v1.0 Release Scope

This document is the source of truth for demonstration and release claims. Research blueprints and design specifications describe product direction; they are not evidence that a capability is deployed.

## Implemented and release-tested

| Capability | Release behavior |
| --- | --- |
| Citizen and managed officer/admin authentication | JWT login, citizen self-registration, role routing, profile read/update, bounded post-expiry refresh, and logout |
| Case management | Citizen-owned case creation, listing and detail; citizens may edit or delete their own open cases, while staff control workflow status and can access the deployment case set |
| Incident metadata | Category, citizen-reported risk and location persist through the case API |
| Evidence references | Evidence type, label, reference and notes attach to a case; this is metadata, not binary upload |
| Case timeline | Persisted timeline entries and evidence timestamps returned by the case API |
| Threat advisory feed | Reads deployment-configured advisory records; optional development reference guidance is disabled by default in production |
| Notifications | Backend notification feed; citizen access is ownership-scoped |
| Operations workspace | Officer dashboard, case queue, investigation workspace, search, filters, pagination, analytics derived from current records, timeline and evidence metadata views |
| Administration boundary | Admin-only route with gateway health and explicit unavailable-control notices |
| Themes and accessibility baseline | Dark, light and system themes, visible focus, reduced motion, responsive layouts, labels and semantic states |
| Reliability | Loading, empty, offline/cached, retry, error-boundary and session-expiry handling |

## Implemented with explicit limitations

| Capability | Limitation |
| --- | --- |
| SOS | Creates a critical case and can open the device dialer for 1930 or the configured contact; it does not dispatch police or share live location |
| Evidence | Stores metadata/reference values only. Device camera, gallery, document transfer, object storage, hashes and chain of custody are not connected |
| Notifications | Read markers in the citizen app are device-local because no read-mutation endpoint exists |
| Command center | Aggregates current API records with transparent polling; no realtime stream exists |
| Geospatial view | Shows official location text only; coordinates, geocoding and a true heat map are unavailable |
| Analytics and prioritization | Deterministic aggregations and documented metadata fallbacks only; no AI inference is presented |
| Threat guidance | Production returns only records provisioned by the deployment. Development may opt into generic reference advisories; they are not live CERT-In alerts |
| Agency isolation | The schema has no organization/tenant boundary. v1.0 must be deployed per agency trust boundary; it is not approved as a shared multi-agency tenancy |
| Abuse and replay controls | Gateway rate limits and refresh replay fingerprints are process-local. Multi-replica production requires approved edge/shared controls |

## Future scope — not active in this release

- Self-service password-reset email/SMS delivery.
- Binary evidence upload, camera transfer, secure object storage and chain of custody.
- Officer assignment, private notes, organizations, user administration, permissions, audit logs and configuration mutation.
- Durable session revocation, multi-device session management, shared distributed rate limiting, and cross-agency tenancy.
- Notification read mutation, push delivery preferences and voice alerts.
- Realtime WebSocket/SSE command channels.
- GIS coordinates, geocoding and operational heat maps.
- Fraud scoring, graph intelligence, counterfeit-image verification and predictive analytics.
- Integrated speech/deepfake inference. `netrak_speech_intelligence` is an experimental standalone prototype, is not connected to the gateway or applications, and is excluded from the v1.0 release candidate.
- Signed Android/iOS distribution and production observability providers, which require deployment-owned credentials.

## Demonstration rule

Do not describe Netrak v1.0 as dispatching emergency services, monitoring citizens, uploading files, streaming live national intelligence, performing AI inference, or sending password-reset messages. Demonstrate the implemented reporting, case, advisory, evidence-reference and operational workflows, and identify the boundaries above when asked.
