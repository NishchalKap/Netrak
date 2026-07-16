# Netrak Mobile

Expo Router client for Netrak's public-safety platform. The app consumes the existing gateway APIs for authentication, profiles, cases, evidence, threats, notifications, and service health.

Release boundaries: evidence is metadata/reference-only, notification read markers are device-local, SOS creates a critical case and opens the dialer but does not dispatch services, and self-service password-reset delivery is not configured. See `../../docs/release-scope.md`.

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
npm run export
npx expo start
```

The app stores authentication tokens in device-only, when-unlocked SecureStore on native platforms and session storage in Expo Web. Non-loopback production API URLs must use HTTPS. Theme, reduced-motion preference, emergency contact, and local notification read state persist between launches. Signed Android and iOS binaries require deployment-owned EAS credentials and store identifiers; `npm run export` validates the JavaScript and asset bundles for all supported platforms without fabricating those credentials.
