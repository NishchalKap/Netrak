import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function RoleSelectionScreen() {
  const { colors } = useAppTheme();
  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <Typography variant="h1">Create citizen account</Typography>
      <Typography variant="body" style={[styles.subtitle, { color: colors.muted }]}>Citizen self-registration is available in this application.</Typography>
      <Card>
        <Button
          title="Continue as citizen"
          iconName="account-heart-outline"
          onPress={() => router.push({ pathname: '/(auth)/register', params: { role: 'CITIZEN' } })}
        />
      </Card>
      <Card style={styles.organizationCard}>
        <View style={styles.organizationHeader}>
          <MaterialCommunityIcons name="shield-account-outline" size={22} color={colors.tint} />
          <Text style={[styles.organizationTitle, { color: colors.text }]}>Organization accounts</Text>
        </View>
        <Text style={[styles.organizationText, { color: colors.muted }]}>Officer and administrator identities are provisioned by an authorized administrator and use the separate Netrak Operations workspace supplied by their deployment.</Text>
      </Card>
      <Button title="Back to sign in" iconName="arrow-left" variant="ghost" onPress={() => router.back()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  organizationCard: { marginTop: 12 },
  organizationHeader: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  organizationText: { fontSize: 13, lineHeight: 20, marginTop: 9 },
  organizationTitle: { fontSize: 15, fontWeight: '800' },
  scroll: { justifyContent: 'center' },
  subtitle: { marginBottom: 18 },
});
