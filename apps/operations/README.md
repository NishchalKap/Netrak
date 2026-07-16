# Netrak Operations

The Netrak operational workspace is the web application used by officers, investigators, command-center teams, and platform administrators.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Configuration:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | Existing Netrak gateway base URL |
| `VITE_API_TIMEOUT` | `10000` | Request timeout in milliseconds |
| `VITE_API_RETRY_ATTEMPTS` | `2` | Retry limit for idempotent transient failures |
| `VITE_POLL_INTERVAL` | `60000` | Transparent refresh interval for query-backed views |

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The Vite config uses the runner loader on Windows so dependency resolution stays inside the application workspace.

Authentication tokens use browser session storage and are cleared when the browser session closes. Theme preference remains in local storage. Production API URLs must use HTTPS. `VITE_` variables are public build-time configuration and must never contain secrets. The static host must apply `public/_headers` or equivalent security headers and narrow CSP `connect-src` to the deployed gateway origin.

## Data policy

The interface never fabricates operational records. Features without a documented API—assignments, internal notes, audit logs, organization management, GIS coordinates, chain of custody, and realtime streams—are represented as explicit capability boundaries. Current views use transparent polling and do not ship inactive realtime controls.
