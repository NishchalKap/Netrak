import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { isValidEmail } from '@/utils';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RegisterScreen() {
  const { colors } = useAppTheme();
  const registerWithCredentials = useAuthStore((state) => state.registerWithCredentials);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    clearError();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 12) {
      setError('Use at least 12 characters for your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    try {
      await registerWithCredentials({ email: email.trim(), password, role: 'CITIZEN' });
    } catch { Alert.alert('Registration failed', 'Check your details and connection, then try again.'); }
  };

  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Typography variant="h1">Create Account</Typography>
        <Typography variant="body" style={styles.subtitle}>
          <Typography variant="body" style={[styles.subtitle, { color: colors.muted }]}>Citizen access</Typography>
        </Typography>
      </View>

      <Card>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input label="Password" secureTextEntry value={password} onChangeText={setPassword} autoComplete="new-password" textContentType="newPassword" />
        <Text style={[styles.passwordHint, { color: colors.muted }]}>Use 12–128 characters. A long, unique passphrase is recommended.</Text>
        <Input label="Confirm password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} autoComplete="new-password" textContentType="newPassword" />
        {(error || authError) && <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error || authError}</Text>}
        <Button title="Create account" iconName="account-plus-outline" loading={isLoading} onPress={handleRegister} />
      </Card>

      <Pressable accessibilityRole="button" style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
        <Text style={[styles.link, { color: colors.tint }]}>Already have an account</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 13,
    marginTop: 4,
  },
  header: {
    marginBottom: 20,
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  passwordHint: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
    marginTop: -6,
  },
  scroll: {
    justifyContent: 'center',
  },
  subtitle: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
