import React, { Component, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/authStore';
import * as SplashScreen from 'expo-splash-screen';
import { useSettingsStore } from '@/store/settingsStore';
import { ThemePalette } from '@/constants';

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
  return <MobileErrorBoundary><RootLayoutInner /></MobileErrorBoundary>;
}

class MobileErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (__DEV__) console.error('Netrak mobile view failed', error, info);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const colors = ThemePalette.dark;
    return <View accessibilityRole="alert" style={[styles.crashScreen, { backgroundColor: colors.background }]}>
      <Text style={[styles.crashEyebrow, { color: colors.tint }]}>NETRAK RECOVERY</Text>
      <Text style={[styles.crashTitle, { color: colors.text }]}>This view could not be opened.</Text>
      <Text style={[styles.crashMessage, { color: colors.muted }]}>Your account and saved information are safe. Retry the application view to continue.</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Retry application" style={[styles.crashButton, { backgroundColor: colors.text }]} onPress={() => this.setState({ failed: false })}>
        <Text style={[styles.crashButtonText, { color: colors.background }]}>Retry application</Text>
      </Pressable>
    </View>;
  }
}

const styles = StyleSheet.create({
  crashButton: { alignItems: 'center', borderRadius: 14, justifyContent: 'center', marginTop: 24, minHeight: 48, paddingHorizontal: 18 },
  crashButtonText: { fontSize: 15, fontWeight: '800' },
  crashEyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 14 },
  crashMessage: { fontSize: 15, lineHeight: 22, marginTop: 12 },
  crashScreen: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  crashTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8, lineHeight: 36 },
});
