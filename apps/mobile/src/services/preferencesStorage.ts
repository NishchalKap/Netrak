import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

const PREFIX = 'netrak.preferences.';
const SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const preferencesStorage: StateStorage = {
  async getItem(name) {
    const key = `${PREFIX}${name}`;
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key, SECURE_OPTIONS);
  },
  async setItem(name, value) {
    const key = `${PREFIX}${name}`;
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value, SECURE_OPTIONS);
  },
  async removeItem(name) {
    const key = `${PREFIX}${name}`;
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key, SECURE_OPTIONS);
  },
};
