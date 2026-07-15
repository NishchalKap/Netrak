import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { isValidEmail } from '@/utils';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const loginWithCredentials = useAuthStore((state) => state.loginWithCredentials);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const handleSignIn = async () => {
    clearError();
    if (!isValidEmail(email)) return setFormError('Enter a valid email address.');
    if (password.length < 6) return setFormError('Password must be at least 6 characters.');
    setFormError(null);
    try { await loginWithCredentials({ email: email.trim(), password }); } catch { Alert.alert('Sign in failed', 'Check your details and connection, then try again.'); }
  };
  return <ScreenContainer scroll contentContainerStyle={styles.scroll}>
    <View style={styles.intro}><Text style={[styles.kicker, { color: colors.tint }]}>WELCOME TO NETRAK</Text><Text style={[styles.title, { color: colors.text }]}>Security should{`\n`}feel simple.</Text><Text style={[styles.copy, { color: colors.muted }]}>Sign in to your private digital safety space.</Text></View>
    <Card style={styles.form}><Input label="Email address" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} error={formError?.includes('email') ? formError : undefined} /><Input label="Password" autoComplete="current-password" secureTextEntry value={password} onChangeText={setPassword} error={formError?.includes('Password') ? formError : undefined} />{error && <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text>}<Button title="Sign in securely" iconName="arrow-right" loading={isLoading} onPress={handleSignIn} /></Card>
    <View style={styles.links}><Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/forgot-password')}><Text style={[styles.link, { color: colors.tint }]}>Forgot password?</Text></Pressable><Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/role-selection')}><Text style={[styles.link, { color: colors.tint }]}>Create account</Text></Pressable></View>
  </ScreenContainer>;
}
const styles = StyleSheet.create({ scroll: { justifyContent: 'center' }, intro: { marginBottom: 32 }, kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 14 }, title: { fontSize: 35, fontWeight: '800', letterSpacing: -1.1, lineHeight: 40 }, copy: { fontSize: 15, marginTop: 12 }, form: { paddingTop: 12 }, error: { fontSize: 13, marginTop: 4 }, links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }, link: { fontSize: 13, fontWeight: '700' } });
