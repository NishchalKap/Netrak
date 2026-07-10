import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { isValidEmail } from '@/utils';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setError(null);
    Alert.alert('Reset link queued', 'Check your registered email when the auth service is connected.');
  };

  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <Typography variant="h1">Reset Password</Typography>
      <Card>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Send reset link" iconName="email-fast-outline" onPress={handleReset} />
      </Card>
      <Pressable style={styles.back} onPress={() => router.back()}>
        <Text style={styles.link}>Back to sign in</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {
    alignItems: 'center',
    marginTop: 18,
  },
  error: {
    color: Colors.light.danger,
    fontSize: 13,
    marginTop: 4,
  },
  link: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    justifyContent: 'center',
  },
});
