import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { router } from 'expo-router';
import { isValidEmail } from '@/utils';

export default function LoginScreen() {
  const { login, loginWithCredentials, isLoading, error, clearError } = useAuthStore();
  const setProfile = useUserStore((state) => state.setProfile);
  const [email, setEmail] = useState('citizen@netrak.local');
  const [password, setPassword] = useState('password123');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async () => {
    clearError();
    if (!isValidEmail(email)) {
      setFormError('Enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setFormError(null);
    try {
      await loginWithCredentials({ email: email.trim(), password });
    } catch {
      Alert.alert('Service unavailable', 'Use demo mode while the local backend is offline.');
    }
  };

  const handleDemo = async () => {
    setProfile({
      id: '00000000-0000-4000-8000-000000000001',
      email: 'citizen@netrak.local',
      role: 'CITIZEN',
      name: 'Citizen User',
      district: 'Demo District',
    });
    await login('demo-token');
  };

  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Typography variant="h1">Netrak</Typography>
        <Typography variant="body" style={styles.subtitle}>
          Citizen fraud shield
        </Typography>
      </View>

      <Card>
        <Input
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={formError?.includes('email') ? formError : undefined}
        />
        <Input
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={formError?.includes('Password') ? formError : undefined}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Sign in" iconName="login" loading={isLoading} onPress={handleSignIn} />
        <Button title="Continue demo" iconName="shield-account-outline" variant="outline" onPress={handleDemo} />
      </Card>

      <View style={styles.links}>
        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.link}>Forgot password</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/role-selection')}>
          <Text style={styles.link}>Create account</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  error: {
    color: Colors.light.danger,
    fontSize: 13,
    marginTop: 4,
  },
  header: {
    marginBottom: 20,
  },
  link: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: '700',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  scroll: {
    justifyContent: 'center',
  },
  subtitle: {
    color: Colors.light.muted,
    fontWeight: '600',
  },
});
