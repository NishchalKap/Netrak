<div align="center">

# Netrak

### AI-Native Public Safety & Investigation Platform

Transforming fragmented citizen reports into structured investigative intelligence through Artificial Intelligence, Speech Intelligence, and Geospatial Analytics.

<p>

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![React Native](https://img.shields.io/badge/React%20Native-Expo-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=flat-square&logo=openstreetmap)
![MIT License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</p>

**ET AI Hackathon 2.0**

Developed by **The Elite Party**

</div>

---

## Overview

Netrak is an AI-native investigation platform designed to modernize digital public safety operations. It enables citizens to securely report incidents while providing investigators with an intelligent operational workspace capable of transforming raw evidence into structured investigative intelligence.

Unlike traditional complaint management systems that primarily record reports, Netrak actively assists investigations through automated speech transcription, large language model–based summarization, entity extraction, geospatial visualization, and AI-assisted decision support.

The platform establishes a unified workflow connecting citizens, investigators, and operational intelligence within a single ecosystem.

---

## The Challenge

Digital fraud, cybercrime, financial scams, identity theft, and social engineering attacks continue to increase in both frequency and sophistication. While attack techniques evolve rapidly, investigative workflows often remain dependent on fragmented reporting systems, manual evidence review, and disconnected operational tools.

This results in several operational challenges:

- Unstructured complaints submitted through multiple channels.
- Manual extraction of relevant investigative information.
- Fragmented evidence management.
- Limited situational awareness across active investigations.
- Increased investigation turnaround time.
- Minimal AI-assisted decision support.

These limitations reduce operational efficiency and delay investigative response.

---

## Our Approach

Netrak introduces an AI-native investigation workflow that augments investigators rather than replacing them.

Citizen-submitted evidence—including text, audio recordings, documents, and supporting media—is processed through an intelligence pipeline that automatically generates structured investigative artifacts. These outputs are then surfaced within an integrated operational dashboard, enabling investigators to focus on decision-making rather than repetitive administrative tasks.

The platform combines operational awareness, evidence management, geospatial visualization, and AI-assisted investigation into a single extensible architecture.

---

## Key Design Principles

| Principle | Description |
|-----------|-------------|
| AI-First | Artificial Intelligence augments every stage of the investigation lifecycle. |
| Unified Operations | Citizens, investigators, evidence, and intelligence operate within a common platform. |
| Modular Architecture | Independent services allow new capabilities to be integrated without major architectural changes. |
| Human-Centered | AI assists investigators while maintaining human oversight and decision authority. |
| Scalable by Design | Built using modern cloud-native technologies suitable for future expansion. |

---

# Platform Overview

Netrak is composed of two primary applications connected through a common backend and AI orchestration layer.

| Platform | Primary Users | Purpose |
|----------|---------------|---------|
| **Citizen Application** | Citizens | Incident reporting, evidence submission, case tracking, notifications |
| **Operations Platform** | Law Enforcement Agencies | Investigation management, operational monitoring, AI-assisted analysis, intelligence visualization |

Both applications communicate through a centralized API Gateway backed by PostgreSQL, Supabase services, and an extensible AI provider architecture.

---

# Core Platform Capabilities

| Capability | Description |
|------------|-------------|
| Case Management | Create, assign, investigate, and resolve cases through a structured workflow. |
| Evidence Management | Securely organize documents, images, audio recordings, and supporting artifacts. |
| AI Investigation Pipeline | Transform raw evidence into structured intelligence using Speech AI and LLMs. |
| Geospatial Intelligence | Visualize incidents geographically through interactive mapping and heat maps. |
| Timeline Reconstruction | Generate chronological investigation timelines from case events. |
| Operational Analytics | Monitor investigation metrics, workload distribution, and operational trends. |
| AI Copilot | Assist investigators with contextual summaries, insights, and investigative guidance. |
| Threat Intelligence | Aggregate and monitor threat advisories and intelligence feeds. |

---

# Investigation Workflow

```text
Citizen
    │
    ▼
Incident Report
    │
    ▼
Evidence Collection
(Text • Images • Audio • Documents)
    │
    ▼
API Gateway
    │
    ▼
AI Processing Pipeline
────────────────────────────────────────
Speech Transcription

↓

Case Summarization

↓

Entity Extraction

↓

Investigation Intelligence
────────────────────────────────────────
    │
    ▼
Case Repository
    │
    ▼
Operations Dashboard
    │
    ├───────────────┐
    ▼               ▼
Analytics      Timeline Explorer

    ├───────────────┤

    ▼               ▼
Heat Maps      AI Copilot

            │

            ▼
      Investigation & Response
```

---

# Operations Platform

The Operations Platform provides investigators with a unified operational workspace designed to support every stage of an investigation.

## Command Center

A centralized operational dashboard providing a live overview of:

- Active investigations
- Investigation status
- Threat activity
- Operational notifications
- Case distribution
- Platform health

---

## Investigation Workspace

A dedicated environment where investigators can:

- Review case information
- Examine supporting evidence
- View AI-generated summaries
- Inspect extracted entities
- Manage investigation timelines
- Interact with the AI Copilot

---

## Geographic Intelligence

Interactive geospatial visualization enables investigators to:

- View reported incidents geographically
- Identify regional patterns
- Detect emerging hotspots
- Improve operational awareness using OpenStreetMap integration

---

## Analytics & Intelligence

Operational dashboards transform investigation data into actionable insights through:

- Case distribution analytics
- Investigation trends
- Threat categorization
- Risk-level analysis
- Performance metrics

  ---

# System Architecture

Netrak follows a modular service-oriented architecture that separates citizen interaction, operational workflows, artificial intelligence, and infrastructure concerns. Each layer is independently extensible, enabling new capabilities to be integrated without impacting existing services.

```text
                           +----------------------+
                           |   Citizen Platform   |
                           |  React Native (Expo) |
                           +----------+-----------+
                                      |
                                      |
                                      v
                           +----------------------+
                           | Operations Platform  |
                           | React • TypeScript   |
                           +----------+-----------+
                                      |
                                      |
                                      v
                    +------------------------------------+
                    |         API Gateway                |
                    |     Express • TypeScript           |
                    +----------------+-------------------+
                                     |
      +------------------------------+-------------------------------+
      |                              |                               |
      v                              v                               v
+--------------+            +----------------+             +----------------+
| Case Service |            | Evidence Layer |             | AI Orchestrator|
+--------------+            +----------------+             +----------------+
      |                              |                               |
      +------------------------------+-------------------------------+
                                     |
                                     v
                         +-------------------------+
                         | Provider Registry       |
                         +-----------+-------------+
                                     |
             +-----------------------+------------------------+
             |                                                |
             v                                                v
    Google Gemini                             Databricks Speech Intelligence

                                     |
                                     v

                         +-------------------------+
                         | PostgreSQL + Prisma ORM |
                         +-------------------------+
                                     |
                     +---------------+---------------+
                     |                               |
                     v                               v
             Supabase Auth                  Supabase Storage
```

---

# Artificial Intelligence Pipeline

Every investigation follows a structured intelligence pipeline designed to reduce manual effort while preserving investigator oversight.

```text
Citizen Report

        │

        ▼

Evidence Submission

(Text • Images • Audio • Documents)

        │

        ▼

Speech Processing

        │

        ▼

Automatic Transcription

        │

        ▼

Large Language Model

        │

        ▼

Case Summary

        │

        ▼

Entity Extraction

(Persons • Phone Numbers • Accounts • Emails • Locations)

        │

        ▼

Structured Investigation Record

        │

        ▼

Officer Workspace

        │

        ▼

AI Copilot Assistance
```

The AI pipeline is implemented as a provider-based architecture, allowing speech models and language models to be replaced or extended without modifying downstream investigation workflows.

---

# Technology Stack

| Layer | Technologies |
|--------|--------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Mobile | React Native, Expo, Expo Router, Zustand |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Authentication | Supabase Auth |
| Storage | Supabase Storage |
| Artificial Intelligence | Google Gemini, Databricks Speech Intelligence |
| Mapping | OpenStreetMap, React Leaflet |
| API Documentation | Swagger / OpenAPI |
| Validation | Zod |
| Data Fetching | TanStack Query |

---

# Engineering Principles

The platform is designed around several architectural principles.

| Principle | Implementation |
|-----------|----------------|
| Modular Services | Independent service boundaries separate business logic from infrastructure concerns. |
| Provider Abstraction | AI providers are registered through a common interface, enabling future model integrations with minimal code changes. |
| API-First Design | All applications communicate through a centralized REST API. |
| Separation of Concerns | Frontend, backend, AI services, and infrastructure remain independently maintainable. |
| Extensibility | Additional intelligence providers, storage systems, and analytics modules can be integrated without restructuring the platform. |

---

# Repository Structure

```text
Netrak
│
├── apps
│   ├── mobile
│   └── operations
│
├── backend
│   └── gateway
│
├── docs
│
├── netrak_speech_intelligence
│
├── packages
│
├── scripts
│
└── README.md
```

Each component is independently deployable while sharing common APIs, authentication, and persistence layers.

---

# Design Philosophy

Netrak is not intended to function solely as a complaint management system.

It is designed as an extensible investigation platform capable of evolving into a broader public safety ecosystem through modular intelligence services, interoperable APIs, and AI-assisted operational workflows.

The architecture prioritizes maintainability, extensibility, and operational transparency over tightly coupled implementations, allowing future capabilities such as predictive analytics, threat intelligence feeds, and inter-agency collaboration to be incorporated with minimal architectural disruption.

---

# Getting Started

## Prerequisites

Ensure the following dependencies are installed before setting up the project.

| Requirement | Version |
|-------------|---------|
| Node.js | >= 20.x |
| npm | >= 10.x |
| PostgreSQL | >= 15 |
| Git | Latest |
| Expo CLI | Latest (Mobile Development) |

---

## Clone the Repository

```bash
git clone https://github.com/<your-org>/netrak.git

cd netrak
```

---

## Install Dependencies

Install dependencies for all workspaces.

```bash
npm install
```

---

## Environment Configuration

Create environment files for each application.

```text
backend/gateway/.env

apps/operations/.env

apps/mobile/.env
```

### Backend

```env
PORT=3000

DATABASE_URL=

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=

GEMINI_API_KEY=

DATABRICKS_API_KEY=

DATABRICKS_ENDPOINT=
```

### Operations Dashboard

```env
VITE_API_URL=http://localhost:3000
```

### Mobile Application

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

---

# Running the Platform

### Backend

```bash
cd backend/gateway

npm run dev
```

---

### Operations Dashboard

```bash
cd apps/operations

npm run dev
```

---

### Mobile Application

```bash
cd apps/mobile

npx expo start
```

---

# API Documentation

Once the backend is running, interactive API documentation is available through Swagger.

```text
http://localhost:3000/api-docs
```

---

# Deployment Architecture

```mermaid
flowchart LR

Developer

--> GitHub

GitHub

--> CI/CD Pipeline

CI/CD Pipeline

--> Backend

CI/CD Pipeline

--> Operations Dashboard

CI/CD Pipeline

--> Mobile Build

Backend

--> PostgreSQL

Backend

--> Supabase

Backend

--> AI Providers
```

---

# Security Considerations

Netrak has been designed with security as a foundational principle.

Current security controls include:

- JWT-based authentication
- Role-based authorization
- Request validation using Zod
- Parameterized database queries through Prisma
- Secure credential management using environment variables
- Protected API routes
- CORS configuration
- Structured request validation
- Centralized authentication using Supabase

Future security enhancements include:

- Multi-factor authentication
- Audit logging
- End-to-end evidence integrity verification
- Tamper detection
- Digital evidence hashing
- Case-level encryption

---

# Performance Goals

| Metric | Target |
|---------|--------|
| API Response | < 300 ms |
| AI Summary Generation | < 10 s |
| Speech Processing | < 30 s |
| Dashboard Load Time | < 2 s |
| Case Search | < 500 ms |

---

# Roadmap

## Phase 1

- [x] Citizen reporting
- [x] Operations dashboard
- [x] AI summarization
- [x] Entity extraction
- [x] Heat map visualization
- [x] Timeline management
- [x] Threat intelligence
- [x] AI Copilot

---

## Phase 2

- [ ] Predictive crime analytics
- [ ] Cross-case intelligence correlation
- [ ] Facial recognition integration
- [ ] Vehicle intelligence
- [ ] Multi-language speech processing
- [ ] Offline mobile reporting
- [ ] Digital evidence chain-of-custody
- [ ] Inter-agency collaboration

---

## Phase 3

- [ ] National intelligence network
- [ ] Federated investigation platform
- [ ] AI-powered investigative recommendations
- [ ] Advanced graph analytics
- [ ] Real-time anomaly detection

---

# Contributing

Contributions are welcome.

If you would like to improve the platform:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

Please ensure new features include appropriate documentation and follow the project's coding conventions.

---

# License

This project is distributed under the MIT License.

See the `LICENSE` file for additional information.

---

# Team

Developed for **ET AI Hackathon 2.0**

**Team:** The Elite Party

---

<div align="center">

Built with modern cloud-native technologies to support the next generation of AI-assisted public safety operations.

</div>
