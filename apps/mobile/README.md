# Netrak Mobile

Expo Router client for Netrak's public-safety platform. The app consumes the existing gateway APIs for authentication, profiles, cases, evidence, threats, notifications, and service health.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set `EXPO_PUBLIC_API_URL` to the gateway `/api` URL reachable from the target device.
3. Install dependencies with `npm install`.
4. Run `npm start` for Expo, or `npm run web` for the web preview.

`localhost` works for Expo Web. Android emulators and physical devices need a host address they can reach, such as the development machine's LAN IP.

## Validation

```text
npm run lint
npm run typecheck
npx expo start
```

The app stores authentication tokens in SecureStore on native platforms. Theme, accessibility, alert preferences, and local notification read state persist between launches.
