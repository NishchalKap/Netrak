import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/authStore';
import * as SplashScreen from 'expo-splash-screen';
import { useSettingsStore } from '@/store/settingsStore';

void SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { paperTheme, colors, isDarkMode } = useAppTheme();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrate = useAuthStore((state) => state.hydrate);
  const segments = useSegments();
  const router = useRouter();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated) return;

    void SplashScreen.hideAsync();
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    const currentSegments = segments as string[];
    const inAuthGroup = currentSegments[0] === '(auth)';
    const isIndex = currentSegments.length === 0 || (currentSegments.length === 1 && currentSegments[0] === 'index');

    if (isAuthenticated && (inAuthGroup || isIndex)) {
      router.replace('/(tabs)/dashboard');
    } else if (!isAuthenticated && !inAuthGroup && !isIndex) {
      router.replace('/(auth)/login');
    }
  }, [isHydrated, isAuthenticated, router, segments]);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduceMotion ? 'none' : 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutInner />;
}
