import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { UserRole } from '@/types';
import { isValidEmail } from '@/utils';

export default function RegisterScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role = useMemo<UserRole>(() => {
    if (params.role === 'OFFICER' || params.role === 'ADMIN') return params.role;
    return 'CITIZEN';
  }, [params.role]);
  const { registerWithCredentials, login, isLoading } = useAuthStore();
  const setProfile = useUserStore((state) => state.setProfile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    try {
      await registerWithCredentials({ email: email.trim(), password, role });
    } catch {
      Alert.alert('Service unavailable', 'A demo profile will be created locally.');
      setProfile({
        id: '00000000-0000-4000-8000-000000000002',
        email: email.trim(),
        role,
        name: email.split('@')[0],
      });
      await login('demo-token');
    }
  };

  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <Typography variant="h1">Create Account</Typography>
        <Typography variant="body" style={styles.subtitle}>
          {role === 'CITIZEN' ? 'Citizen access' : `${role.toLowerCase()} access`}
        </Typography>
      </View>

      <Card>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input label="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <Input label="Confirm password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Create account" iconName="account-plus-outline" loading={isLoading} onPress={handleRegister} />
      </Card>

      <Pressable style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.link}>Already have an account</Text>
      </Pressable>
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
  loginLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  scroll: {
    justifyContent: 'center',
  },
  subtitle: {
    color: Colors.light.muted,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
