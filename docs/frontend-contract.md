# Netrak Frontend Integration Contract

> Release note: this document describes gateway contracts, not every deployed product capability. `docs/release-scope.md` is authoritative for demonstration status and future scope.

This contract is the handoff document for frontend engineering tools (including Lovable). It describes the gateway endpoints, auth flow, payload contracts, error handling, and the expected integration patterns for the Netrak application.

## 1. Project Overview

Netrak is a digital public safety platform for citizens, officers, and administrators. The backend exposes case management, threat intelligence, user auth, and notifications through a single API gateway.

## 2. Backend Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3000/api` |
| Swagger UI | `http://localhost:3000/api-docs` |
| OpenAPI JSON | `http://localhost:3000/openapi.json` |
| Root health | `http://localhost:3000/health` |
| API health | `http://localhost:3000/api/health` |

## 3. Authentication Flow

The gateway uses JWT bearer tokens issued on login and registration.

### Step 1 — Obtain a token

Call one of the public auth endpoints:

- `POST /auth/login` — existing user
- `POST /auth/register` — new user

Both return:

```json
{
  "status": "success",
  "message": "Logged in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "citizen@netrak.local",
      "role": "CITIZEN"
    }
  }
}
```

### Step 2 — Attach token to protected requests

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Step 3 — Handle 401 responses

If a protected request returns `401`, call `POST /auth/refresh` with the current token before retrying the original request.

### Public endpoints (no auth required)

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `POST /auth/forgot-password` — reserved boundary; returns `503` until deployment-owned delivery is integrated
- `GET /health`
- `GET /api/health`
- `GET /threats`
- `GET /threats/:id`

### Protected endpoints (auth required)

- `GET /auth/profile`
- `PATCH /auth/profile`
- `GET /cases`
- `POST /cases`
- `GET /cases/:id`
- `PATCH /cases/:id`
- `DELETE /cases/:id`
- `POST /cases/:id/evidence`
- `GET /notifications`
- `POST /notifications`

## 4. JWT

| Property | Value |
|----------|-------|
| Algorithm | HS256 |
| Expiry | 1 hour |
| Payload | `{ id: string, sub: string, role: string, jti: string }` |
| Header | `Authorization: Bearer <token>` |

The JWT is self-contained and the gateway does not maintain a durable session store. A bounded in-process fingerprint cache rejects reuse of a token at the refresh endpoint. Native clients use secure device storage; the supplied web applications use session storage so tokens are cleared with the browser session.

## 5. Refresh Token

The gateway uses a single-token refresh model (not a separate refresh/access token pair). A correctly signed token may be renewed once during the configured, bounded post-expiry grace period; reuse at the same gateway process is rejected. After that period the user must sign in again. Multi-replica deployments require an approved shared replay/rate-limit layer or a single active gateway replica.

**Request:**

```
POST /auth/refresh
Content-Type: application/json

{
  "token": "<existing-jwt>"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Recommended client flow:**

1. On `401`, attempt one refresh via `POST /auth/refresh`.
2. Replace the stored token with the new value.
3. Retry the failed request once with the new token.
4. If refresh also returns `401`, redirect to login.

## 6. User Roles

| Role | Description |
|------|-------------|
| `CITIZEN` | Report incidents, manage their own open case details, attach evidence references, and view advisories |
| `OFFICER` | Manage cases and update status |
| `ADMIN` | Platform-level operations |

Roles are embedded in the JWT payload and returned on the `user` object.

## 7. API Response Format

Every successful response uses:

```json
{
  "status": "success",
  "message": "Human readable summary",
  "data": {}
}
```

Read resource payloads from `response.data.data` when using Axios.

## 8. API Error Format

Every error response uses:

```json
{
  "status": "error",
  "message": "Human readable error",
  "requestId": "request-correlation-id",
  "errors": []
}
```

Validation failures return `400` with field-level details:

```json
{
  "status": "error",
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

Read errors from `error.response.data` when using Axios.

## 9. Pagination

Pagination is not yet implemented for list endpoints. The gateway caps `GET /cases`, `GET /notifications`, and `GET /threats` using `MAX_LIST_RESULTS` to prevent unbounded responses. Clients must not assume that these arrays represent records beyond the configured release limit.

## 10. Date Format

All timestamps are ISO 8601 UTC strings, e.g. `2026-07-10T10:00:00.000Z`.

## 11. Evidence Reference Specification

Evidence is metadata-only in v1.0. Files are not transferred to the gateway; approved HTTPS evidence-system links, filenames, transaction IDs, or other reference values are stored via `POST /cases/:id/evidence`.

### Image

```json
{
  "type": "image",
  "label": "Screenshot of threat call",
  "reference": "threat-screenshot.png",
  "notes": "Received at 3:15 PM"
}
```

### Audio

```json
{
  "type": "audio",
  "label": "Call recording",
  "reference": "call.mp3",
  "notes": "Voice evidence"
}
```

### Document

```json
{
  "type": "document",
  "label": "PDF statement",
  "reference": "statement.pdf",
  "notes": "Official statement"
}
```

Allowed `type` values: `audio`, `image`, `video`, `document`, `chat`, `link`, `note`.

## 12. Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Gateway listen port |
| `NODE_ENV` | `development` | Runtime environment |
| `JWT_SECRET` | (dev default) | JWT signing secret |
| `JWT_ISSUER` | `netrak-gateway` | Expected token issuer |
| `JWT_AUDIENCE` | `netrak-clients` | Expected token audience |
| `JWT_REFRESH_GRACE_SECONDS` | `900` | Maximum post-expiry refresh window |
| `DATABASE_URL` | (dev default) | PostgreSQL connection string |
| `CORS_ORIGINS` | local citizen and operations origins | Comma-separated browser origins; wildcard is rejected in production |
| `MAX_LIST_RESULTS` | `500` | Maximum records returned by current non-paginated list endpoints |
| `TRUST_PROXY` | `false` | Trust reverse-proxy forwarding headers |
| `API_DOCS_ENABLED` | enabled outside production | Swagger exposure toggle |
| `PUBLIC_API_URL` | unset | Public API URL used in generated documentation |
| `ALLOW_PRIVILEGED_REGISTRATION` | `false` | Development-only managed-role registration switch |
| `ALLOW_LEGACY_PASSWORD_MIGRATION` | `false` | One-time plaintext legacy migration switch; rejected in production |
| `LOAD_REFERENCE_ADVISORIES` | enabled outside production | Generic development guidance; production defaults to deployment records only |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000/api` | API base URL |
| `EXPO_PUBLIC_API_TIMEOUT` | `10000` | Request timeout (ms) |
| `EXPO_PUBLIC_API_RETRY_ATTEMPTS` | `2` | Max retry count for transient failures |
| `VITE_API_URL` | `http://localhost:3000/api` | Operations API base URL |
| `VITE_API_TIMEOUT` | `10000` | Operations request timeout (ms) |
| `VITE_API_RETRY_ATTEMPTS` | `2` | Operations retry limit for idempotent requests |
| `VITE_POLL_INTERVAL` | `60000` | Operations polling interval (ms); no realtime stream is implied |

## 13. Required Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | All POST/PATCH requests |
| `Authorization` | `Bearer <token>` | Protected endpoints |

## 14. HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Successful read or update |
| `201` | Resource created |
| `400` | Validation or malformed request |
| `401` | Invalid or expired token |
| `403` | Forbidden (insufficient role) |
| `404` | Entity not found |
| `409` | Request conflicts with current workflow state |
| `429` | Rate limit exceeded |
| `500` | Unexpected server failure |
| `503` | Required deployment integration or dependency unavailable |

## 15. Retry Policy

- Retry transient network failures and `5xx` responses up to **2** times.
- Use a request timeout of **10 seconds**.
- Do **not** retry `400` validation failures or `401` without attempting token refresh first.
- Use exponential backoff: 300ms × retry attempt.

## 16. Shared Types

Import strongly typed contracts from `shared/types/api.ts`:

```typescript
import { LoginRequest, LoginResponse, Case, ApiError } from '../../shared/types/api';
```

## 17. Example Clients

Production-quality Axios examples are in `docs/examples/`:

- `client.ts` — shared client with retry and error normalization
- `login.ts` — auth and token refresh
- `profile.ts` — profile read and update
- `cases.ts` — case CRUD and evidence-reference metadata
- `notifications.ts` — notification list and create
- `threats.ts` — deployment-configured advisory feed

## 18. Postman Collection

Import `docs/postman/Netrak.postman_collection.json` for manual testing. Set the `jwtToken` variable after login.

## 19. OpenAPI

Full machine-readable spec: `http://localhost:3000/openapi.json`

All endpoints include summary, description, request/response schemas, error responses, and example payloads.
