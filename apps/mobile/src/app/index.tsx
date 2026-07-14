import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemePalette } from '@/constants';
import { useThemeStore } from '@/store/themeStore';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function Index() {
  const { setMode } = useThemeStore();
  const { isDarkMode } = useAppTheme();
  const colors = isDarkMode ? ThemePalette.dark : ThemePalette.light;
  return (
    <ScreenContainer style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page}>
      <View style={styles.topRow}><View style={styles.brand}><View style={[styles.mark, { backgroundColor: `${colors.tint}18`, borderColor: `${colors.tint}40` }]}><MaterialCommunityIcons name="shield-outline" color={colors.tint} size={22} /></View><Text style={[styles.brandText, { color: colors.text }]}>netrak</Text></View><Pressable accessibilityRole="switch" accessibilityState={{ checked: isDarkMode }} accessibilityLabel="Toggle dark mode" onPress={() => setMode(isDarkMode ? 'light' : 'dark')} style={[styles.themeToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}><MaterialCommunityIcons name={isDarkMode ? 'weather-sunny' : 'weather-night'} color={colors.text} size={18} /></Pressable></View>
      <View style={styles.hero}>
        <Text style={[styles.kicker, { color: colors.tint }]}>DIGITAL PUBLIC SAFETY</Text>
        <Text style={[styles.title, { color: colors.text }]}>A calmer way{`\n`}to stay protected.</Text>
        <Text style={[styles.copy, { color: colors.muted }]}>Netrak helps you recognise, report, and recover from digital fraud—with care when it matters most.</Text>
      </View>
      <View style={styles.footer}>
        <Pressable accessibilityRole="button" style={[styles.primary, { backgroundColor: colors.text }]} onPress={() => router.push('/(auth)/login')}><Text style={[styles.primaryText, { color: colors.background }]}>Continue to Netrak</Text><MaterialCommunityIcons name="arrow-right" color={colors.background} size={20} /></Pressable>
        <Text style={[styles.note, { color: colors.muted }]}>Trusted public-safety intelligence for citizens and institutions.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  page: { justifyContent: 'space-between', paddingBottom: 28, paddingTop: 22 }, topRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, brand: { alignItems: 'center', flexDirection: 'row', gap: 10 }, mark: { alignItems: 'center', borderRadius: 12, borderWidth: 1, height: 42, justifyContent: 'center', width: 42 }, themeToggle: { alignItems: 'center', borderRadius: 13, borderWidth: 1, height: 42, justifyContent: 'center', width: 42 }, brandText: { fontSize: 22, fontWeight: '800', letterSpacing: -0.7 }, hero: { marginBottom: 38 }, kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 18 }, title: { fontSize: 40, fontWeight: '800', letterSpacing: -1.5, lineHeight: 45 }, copy: { fontSize: 16, lineHeight: 24, marginTop: 20, maxWidth: 330 }, footer: { gap: 17 }, primary: { alignItems: 'center', borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', minHeight: 58, paddingHorizontal: 20 }, primaryText: { fontSize: 15, fontWeight: '800' }, note: { fontSize: 11, lineHeight: 16, textAlign: 'center' },
});
