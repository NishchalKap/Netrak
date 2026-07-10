# Netrak Frontend Integration Contract

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
- `POST /auth/forgot-password`
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
| Payload | `{ id: string, role: string }` |
| Header | `Authorization: Bearer <token>` |

The JWT is stateless. The gateway does not maintain a server-side session store. Store the token securely on the client (e.g. secure storage on mobile, httpOnly cookie or secure local storage on web).

## 5. Refresh Token

The gateway uses a single-token refresh model (not a separate refresh/access token pair).

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
| `CITIZEN` | Report incidents, create cases, view threats |
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

Pagination is not yet implemented for list endpoints. Clients should treat `GET /cases`, `GET /notifications`, and `GET /threats` as full-list responses.

The `PaginatedResponse` type in `shared/types/api.ts` is reserved for future use:

```json
{
  "items": [],
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5
}
```

## 10. Date Format

All timestamps are ISO 8601 UTC strings, e.g. `2026-07-10T10:00:00.000Z`.

## 11. Upload Specification

Evidence is metadata-first. Files are referenced by URI/path; the gateway stores metadata via `POST /cases/:id/evidence`.

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
| `DATABASE_URL` | (dev default) | PostgreSQL connection string |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000/api` | API base URL |
| `EXPO_PUBLIC_API_TIMEOUT` | `10000` | Request timeout (ms) |
| `EXPO_PUBLIC_API_RETRY_ATTEMPTS` | `2` | Max retry count for transient failures |

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
| `500` | Unexpected server failure |

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
- `profile.ts` — profile and password reset
- `cases.ts` — case CRUD and evidence upload
- `notifications.ts` — notification list and create
- `threats.ts` — public threat feed

## 18. Postman Collection

Import `docs/postman/Netrak.postman_collection.json` for manual testing. Set the `jwtToken` variable after login.

## 19. OpenAPI

Full machine-readable spec: `http://localhost:3000/openapi.json`

All endpoints include summary, description, request/response schemas, error responses, and example payloads.
