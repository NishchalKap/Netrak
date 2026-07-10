import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors } from '@/constants';
import { useCaseStore } from '@/store/caseStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function EmergencySosScreen() {
  const createCase = useCaseStore((state) => state.createCase);
  const isLoading = useCaseStore((state) => state.isLoading);
  const addLocalNotification = useNotificationStore((state) => state.addLocalNotification);
  const emergencyContact = useSettingsStore((state) => state.emergencyContact);
  const [location, setLocation] = useState('');
  const [context, setContext] = useState('Live call pressure or demand for immediate transfer.');

  const createSosCase = async () => {
    const caseItem = await createCase({
      title: 'Emergency SOS escalation',
      description: context.trim() || 'Citizen triggered emergency SOS from mobile app.',
      category: 'digital_arrest',
      location: location.trim() || undefined,
      riskLevel: 'critical',
    });
    addLocalNotification('Emergency SOS case created.', 'sos');
    router.replace({ pathname: '/(tabs)/case/[id]', params: { id: caseItem.id } });
  };

  const callNumber = async (value: string) => {
    const supported = await Linking.canOpenURL(`tel:${value}`);
    if (supported) {
      await Linking.openURL(`tel:${value}`);
    } else {
      Alert.alert('Dialer unavailable', `Call ${value} from your phone dialer.`);
    }
  };

  return (
    <ScreenContainer scroll>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.light.text} />
      </Pressable>

      <Typography variant="h1">Emergency SOS</Typography>
      <Card tone="danger" style={styles.hero}>
        <View style={styles.siren}>
          <MaterialCommunityIcons name="alarm-light-outline" size={42} color={Colors.light.danger} />
        </View>
        <Text style={styles.heroTitle}>Immediate escalation</Text>
        <Text style={styles.heroText}>Use this for live coercion, digital arrest threats, or forced payment pressure.</Text>
      </Card>

      <Card style={styles.section}>
        <Input label="Location" value={location} onChangeText={setLocation} placeholder="City, district, or landmark" />
        <Input
          label="Context"
          value={context}
          onChangeText={setContext}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.contextInput}
        />
      </Card>

      <Button
        title="Create SOS case"
        iconName="shield-alert-outline"
        variant="danger"
        loading={isLoading}
        onPress={createSosCase}
      />

      <View style={styles.callGrid}>
        <Button title="Call 1930" iconName="phone-alert-outline" variant="outline" onPress={() => callNumber('1930')} />
        <Button title={`Call ${emergencyContact}`} iconName="phone-outline" variant="outline" onPress={() => callNumber(emergencyContact)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginBottom: 12,
    width: 42,
  },
  callGrid: {
    gap: 8,
  },
  contextInput: {
    minHeight: 96,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 12,
  },
  heroText: {
    color: Colors.light.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: 'center',
  },
  heroTitle: {
    color: Colors.light.danger,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 12,
  },
  section: {
    marginBottom: 12,
  },
  siren: {
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
});
