import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'netrak.token';
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/** SecureStore on native; localStorage fallback for Expo web. */
export const tokenStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') return globalThis.sessionStorage?.getItem(TOKEN_KEY) ?? null;
    return SecureStore.getItemAsync(TOKEN_KEY, SECURE_OPTIONS);
  },
  async set(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
      globalThis.sessionStorage?.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token, SECURE_OPTIONS);
  },
  async remove(): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
      globalThis.sessionStorage?.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY, SECURE_OPTIONS);
  },
};
