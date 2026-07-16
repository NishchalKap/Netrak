import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();

  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <Typography variant="h1">Password recovery</Typography>
      <Card>
        <Text style={[styles.title, { color: colors.text }]}>Deployment integration required</Text>
        <Text style={[styles.body, { color: colors.muted }]}>
          Self-service email delivery is not configured in this release. Contact the administrator responsible for your Netrak deployment to recover access.
        </Text>
        <Text style={[styles.note, { color: colors.muted, borderTopColor: colors.border }]}>
          Netrak will not claim that a reset message was sent when no approved delivery provider is connected.
        </Text>
      </Card>
      <Pressable accessibilityRole="button" style={styles.back} onPress={() => router.back()}>
        <Text style={[styles.link, { color: colors.tint }]}>Back to sign in</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { alignItems: 'center', marginTop: 18 },
  body: { fontSize: 14, lineHeight: 21, marginTop: 8 },
  link: { fontSize: 14, fontWeight: '700' },
  note: { borderTopWidth: StyleSheet.hairlineWidth, fontSize: 12, lineHeight: 18, marginTop: 18, paddingTop: 16 },
  scroll: { justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '800' },
});
