import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StateStorage } from 'zustand/middleware';

const PREFIX = 'netrak.preferences.';

export const preferencesStorage: StateStorage = {
  async getItem(name) {
    const key = `${PREFIX}${name}`;
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },
  async setItem(name, value) {
    const key = `${PREFIX}${name}`;
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(name) {
    const key = `${PREFIX}${name}`;
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
