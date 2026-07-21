# 📱 Netrak Mobile App

Expo Router client for Netrak's public-safety platform. The app consumes the existing gateway APIs for authentication, profiles, cases, evidence, threats, notifications, and service health.

## ✨ Features
- Citizen incident reporting with multimedia evidence upload
- Real-time case tracking
- Secure authentication with Supabase
- Emergency SOS feature
- Notifications for case updates
- Threat intelligence feeds
- User profile and settings
- Dark/light theme support

## 🛠️ Tech Stack
- Expo (React Native)
- TypeScript
- Expo Router
- Zustand (state management)
- React Native Paper (UI components)
- Expo Secure Store (token storage)

## 🚀 Local Setup

1. **Configure Environment Variables**
   Copy `.env.example` to `.env` and set:
   - `EXPO_PUBLIC_API_URL`: Gateway `/api` URL reachable from your device
   - Use `localhost` for Expo Web
   - Use your machine's LAN IP for emulators/physical devices

2. **Install Dependencies**
```bash
npm install
```

3. **Run the App**
```bash
npm start          # Start Expo dev server
npm run web        # Run web preview
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator (macOS only)
```

## 🧪 Validation

```bash
npm run lint       # Lint code
npm run typecheck  # Check TypeScript types
npm run export     # Validate JS/asset bundles
```

## 🔐 Security
- Authentication tokens stored in device-only, when-unlocked SecureStore
- Non-loopback production API URLs must use HTTPS

---
**Team: The Elite Party** | **ET AI Hackathon 2.0**
