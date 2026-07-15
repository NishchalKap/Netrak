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
| `VITE_POLL_INTERVAL` | `60000` | Transparent refresh interval for query-backed views |

## Quality commands

```bash
npm run lint
npm run typecheck
npm run build
```

The Vite config uses the runner loader on Windows so dependency resolution stays inside the application workspace.

Authentication tokens use browser session storage and are cleared when the browser session closes. Theme preference remains in local storage. `VITE_` variables are public build-time configuration and must never contain secrets.

## Data policy

The interface never fabricates operational records. Features without a documented API—assignments, internal notes, audit logs, organization management, GIS coordinates, chain of custody, and realtime streams—are represented as explicit capability boundaries. Future services can plug into the typed repository, GeoJSON, and realtime interfaces without replacing the UI architecture.
