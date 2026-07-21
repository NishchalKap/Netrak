# Netrak AI Platform Integration Guide

This document describes the architectural changes implemented in Netrak to transform it into an extensible, AI-native platform.

## Folder Structure

The core AI domain is centralized within `backend/gateway/src/ai/`:

```
backend/gateway/src/ai/
├── controllers/          # Exposes the AI APIs to external clients
│   ├── ai-speech.controller.ts
│   └── ...
├── interfaces/           # Defines the provider contracts
│   ├── provider.interface.ts
│   └── speech-provider.interface.ts
├── jobs/                 # Queue abstractions for background processing
│   ├── queue.interface.ts
│   └── in-process.queue.ts
├── providers/            # Concrete implementations of external AI services
│   ├── registry.ts       # Central Service Registry
│   └── speech/
│       └── databricks-speech.provider.ts
├── routes/               # Express routing for /api/ai
│   └── ai.routes.ts
└── services/             # Business logic and database orchestration
    └── speech.service.ts
```

## AI Provider Abstraction

Instead of tightly coupling components directly to specific AI services (e.g., Databricks, OpenAI, Gemini), Netrak relies on the `AIProvider` abstraction. 

- **`AIProvider` Base**: Every provider implements `name` and `healthCheck()`.
- **Domain-Specific Interfaces**: Domains extend `AIProvider` (e.g., `SpeechProvider` requires a `transcribe()` method).
- **Service Registry**: The `AIServiceRegistry` dynamically resolves the configured provider instance (driven by environment variables) so that controllers and services interact only with the interface.

## Configuration & Resiliency

- **Environment Variables Only**: All external API keys, URLs, and secrets are configured via environment variables and validated at startup using Zod in `src/config/env.ts`.
- **Error Handling**: Provider implementations must include timeouts, retries with exponential backoff, and return typed `AppError` exceptions for graceful degradation.

## Data Flow

1. **Client** (e.g., Frontend React Hook `useSpeech()`) makes a generic request to `POST /api/ai/speech/transcribe`.
2. **Controller** validates the request and delegates to the corresponding **Service**.
3. **Service** retrieves the active provider from the **Service Registry**.
4. **Service** executes the request via the **Provider**.
5. **Provider** securely handles the network call with retries and formats the response to standardized interfaces (`TranscriptionResponse`).
6. **Service** logs the `AIInferenceHistory` and optionally stores domain entities (e.g., `Transcription`, `ThreatScore`) using Prisma.
7. **Controller** returns the standardized result to the Client.

## How to Add a New AI Provider

1. **Implement the Interface**: Create a new class under `src/ai/providers/[domain]/` that implements the specific domain interface (e.g., `SpeechProvider`).
2. **Handle Errors**: Ensure you use `fetchWithRetry` or a similar robust mechanism.
3. **Update Configuration**: Add required environment variables to `src/config/env.ts`.
4. **Register**: Modify `src/ai/providers/registry.ts` to instantiate your new provider based on configuration.

## How to Add New Background Jobs

1. **Implement Job Logic**: Create a handler function that processes the required payload.
2. **Register with Queue**: Use the `QueueProvider` (currently using `InProcessQueue`, but designed to be swappable with Redis/BullMQ) to register the handler via `queue.process('job-name', handler)`.
3. **Enqueue**: Where needed in a service, use `queue.enqueue('job-name', payload)`.
