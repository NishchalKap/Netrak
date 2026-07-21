# 🚓 Netrak Operations Dashboard

The Netrak operational workspace is the web application used by officers, investigators, command-center teams, and platform administrators.

## ✨ Features
- Command Center with live incident overview
- Case management and investigation workspace
- Heat maps with geospatial visualization
- Timeline explorer for case events
- Analytics and reporting
- AI Copilot for investigation assistance
- Threat intelligence
- Evidence management
- User profile and settings

## 🛠️ Tech Stack
- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Recharts
- Leaflet + React Leaflet (OpenStreetMap)
- Framer Motion
- Lucide React Icons

## 🚀 Setup

```bash
npm install
copy .env.example .env  # or cp .env.example .env on macOS/Linux
npm run dev
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | Netrak gateway base URL |
| `VITE_API_TIMEOUT` | `10000` | Request timeout in milliseconds |
| `VITE_API_RETRY_ATTEMPTS` | `2` | Retry limit for transient failures |
| `VITE_POLL_INTERVAL` | `60000` | Refresh interval for views |

## 🧪 Quality Commands

```bash
npm run lint       # Lint code
npm run typecheck  # Check TypeScript types
npm test           # Run tests
npm run build      # Build for production
```

## 📱 Responsive Design
The dashboard is fully responsive and works on desktop, tablet, and mobile devices.

## 🔐 Security
- Authentication tokens stored in browser session storage
- Production API URLs must use HTTPS
- `VITE_` variables are public and must never contain secrets

---
**Team: The Elite Party** | **ET AI Hackathon 2.0**
