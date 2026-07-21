<div align="center">
  <h1>🚓 Netrak</h1>
  <p><strong>Digital Public Safety Platform for Citizens & Law Enforcement</strong></p>
  <p><strong>Team: The Elite Party</strong> | <strong>Hackathon: ET AI Hackathon 2.0</strong></p>
</div>

---

## 🎯 What is Netrak?

Netrak is a comprehensive digital public-safety platform that connects citizens with law enforcement, financial institutions, telecom operators, and government agencies. It features:

- **Citizen Mobile App**: Report incidents, upload evidence, and track status
- **Law Enforcement Operations Dashboard**: Command center, analytics, case management, heat maps, and AI copilot
- **AI-Powered Pipeline**: Speech-to-text transcription, summarization, entity extraction, and threat intelligence
- **Secure & Scalable**: Built with modern technologies for reliability and performance

---

## ✨ Key Features

### 📱 Citizen Mobile App
- Incident reporting with multimedia evidence upload
- Real-time case tracking
- Secure authentication
- Push notifications for updates

### 👮 Law Enforcement Operations Dashboard
- **Command Center**: Live overview of active incidents and resources
- **Case Management**: Full investigation workflow with evidence tracking
- **Heat Maps**: Geospatial visualization of incidents
- **Timeline Explorer**: Chronological view of case events
- **Analytics**: Data-driven insights and reports
- **AI Copilot**: AI-powered assistance for investigations
- **Threat Intelligence**: Real-time threat analysis and alerts

### 🤖 AI Capabilities
- Speech-to-text transcription (Databricks/Whisper)
- Automatic case summarization
- Entity extraction (names, phone numbers, emails, locations, etc.)
- Threat classification
- Multilingual support

---

## 🏗️ Architecture

### Tech Stack

#### Backend
- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **API Docs**: Swagger/OpenAPI
- **AI/ML**: Gemini API (LLM), Databricks Speech-to-Text
- **Rate Limiting**: Custom middleware

#### Frontend (Operations Dashboard)
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router
- **Data Fetching**: TanStack Query
- **Styling**: Tailwind CSS + Custom Design System
- **Charts**: Recharts
- **Maps**: Leaflet + React Leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **Animations**: Framer Motion

#### Mobile App
- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL (or use Supabase PostgreSQL)
- Supabase account (for storage/auth)
- Gemini API key
- Databricks Speech-to-Text endpoint (optional)

### Local Installation & Setup

1. **Clone the repo**
```bash
git clone https://github.com/NishchalKap/Netrak.git
cd Netrak
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure Environment Variables**
   - For backend: Copy `backend/gateway/.env.example` to `backend/gateway/.env` and fill in values
   - For operations: Copy `apps/operations/.env.example` to `apps/operations/.env` and fill in values
   - For mobile: Copy `apps/mobile/.env.example` to `apps/mobile/.env` and fill in values

4. **Run Database Migration & Seed**
```bash
cd backend/gateway
npm run prisma:migrate:deploy
npm run prisma:seed
```

5. **Start Backend**
```bash
cd backend/gateway
npm run dev
```
Backend will be available at http://localhost:3000

6. **Start Operations Dashboard**
```bash
cd apps/operations
npm run dev
```
Dashboard will be available at http://localhost:4173

7. **Start Mobile App**
```bash
cd apps/mobile
npm run start
```
Use Expo Go app to scan the QR code

## 🌐 Deploying to Vercel

### Deploy Operations Dashboard (Frontend)
1. Connect your GitHub repo to Vercel
2. Set the **Root Directory** to `apps/operations`
3. Configure environment variables in Vercel (copy from `apps/operations/.env.example`)
4. Deploy!

### Deploy Backend
The backend is best deployed on a Node.js hosting platform (e.g., Railway, Render, AWS, etc.)
- Set environment variables from `backend/gateway/.env.example`
- Run database migrations before starting the server
- Seed the database for demo credentials

## 🔐 Demo Login Credentials
These are created when you run `npm run prisma:seed`:

| Role      | Email                  | Password             |
|-----------|------------------------|----------------------|
| Admin     | admin@netrak.local     | NetrakAdmin!2026     |
| Officer   | officer@netrak.local   | NetrakOfficer!2026   |
| Citizen   | citizen@netrak.local   | NetrakCitizen!2026   |

---

## 📖 Usage Guide

### For Citizens
1. Download the Netrak mobile app
2. Create an account or sign in
3. Report an incident with details and evidence
4. Track your case status in real-time

### For Law Enforcement Officers
1. Open the Operations Dashboard
2. Sign in with your officer/admin credentials
3. View the Command Center for live updates
4. Manage cases, add evidence, and collaborate
5. Use the AI Copilot for investigation assistance
6. View heat maps, timelines, and analytics

---

## 📚 Documentation

- [Architecture Summary](docs/architecture/architecture-summary.md)
- [Operational Platform](docs/architecture/operational-platform.md)
- [AI Platform Integration](docs/architecture/ai-platform-integration.md)
- [Design System](docs/design/DESIGN.md)
- [Release Candidate Runbook](docs/release-candidate.md)
- [Security Policy](SECURITY.md)

---

## 🤝 Team

**The Elite Party**

---

## 📝 License

This project is licensed under the MIT License.

---

## 🎉 Acknowledgments

- ET AI Hackathon 2.0
- Open-source contributors
