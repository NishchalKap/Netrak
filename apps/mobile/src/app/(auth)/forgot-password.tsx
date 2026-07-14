import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { isValidEmail } from '@/utils';
import { useAppTheme } from '@/hooks/useAppTheme';
import { authApi } from '@/services/authApi';
import { getApiErrorMessage } from '@/services/apiError';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setIsSent(true);
      Alert.alert('Reset link queued', 'If the account exists, password reset instructions will be sent shortly.');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to request a reset link. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <Typography variant="h1">Reset Password</Typography>
      <Card>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        {error && <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error}</Text>}
        {isSent && <Text accessibilityLiveRegion="polite" style={[styles.success, { color: colors.success }]}>Reset request submitted.</Text>}
        <Button title="Send reset link" iconName="email-fast-outline" loading={isLoading} onPress={handleReset} />
      </Card>
      <Pressable accessibilityRole="button" style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.link, { color: colors.tint }]}>Back to sign in</Text>
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
    fontSize: 13,
    marginTop: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: '700',
  },
  scroll: {
    justifyContent: 'center',
  },
  success: { fontSize: 13, fontWeight: '600', marginTop: 4 },
});
