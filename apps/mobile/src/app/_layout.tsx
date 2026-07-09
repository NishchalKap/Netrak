import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/authStore';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { paperTheme, colors, isDarkMode } = useAppTheme();
  const { isHydrated, isAuthenticated, hydrate } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      setIsNavigationReady(true);
      SplashScreen.hideAsync();
    }, 500);

    return () => clearTimeout(timer);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated || !isNavigationReady) return;

    const currentSegments = segments as string[];
    const inAuthGroup = currentSegments[0] === '(auth)';
    const isIndex = currentSegments.length === 0 || (currentSegments.length === 1 && currentSegments[0] === 'index');

    if (isAuthenticated && (inAuthGroup || isIndex)) {
      router.replace('/(tabs)/dashboard');
    } else if (!isAuthenticated && !inAuthGroup && !isIndex) {
      router.replace('/(auth)/login');
    }
  }, [isHydrated, isNavigationReady, isAuthenticated, segments]);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
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
