import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { useThemeStore } from '@/store/themeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const {
    locationSharing,
    voiceAlerts,
    emergencyContact,
    preferredLanguage,
    compactMode,
    setLocationSharing,
    setVoiceAlerts,
    setEmergencyContact,
    setPreferredLanguage,
    setCompactMode,
  } = useSettingsStore();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScreenContainer scroll>
      <Typography variant="h1">Settings</Typography>

      <Card style={styles.section}>
        <SettingsRow
          iconName="account-circle-outline"
          title="Profile"
          value="Contact and jurisdiction"
          onPress={() => router.push('/(tabs)/profile')}
        />
        <SettingsRow
          iconName="bell-outline"
          title="Notifications"
          value="Alerts and case updates"
          onPress={() => router.push('/(tabs)/notifications')}
        />
      </Card>

      <Card style={styles.section}>
        <ToggleRow title="Dark mode" value={isDarkMode} onChange={toggleTheme} />
        <ToggleRow title="Location sharing" value={locationSharing} onChange={setLocationSharing} />
        <ToggleRow title="Voice alerts" value={voiceAlerts} onChange={setVoiceAlerts} />
        <ToggleRow title="Compact case cards" value={compactMode} onChange={setCompactMode} />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency</Text>
        <Input
          label="Emergency contact"
          value={emergencyContact}
          keyboardType="phone-pad"
          onChangeText={setEmergencyContact}
        />
        <Button title="Open SOS" iconName="alarm-light-outline" variant="danger" onPress={() => router.push('/(tabs)/sos')} />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <Input label="Preferred language" value={preferredLanguage} onChangeText={setPreferredLanguage} />
      </Card>

      <Button title="Sign out" iconName="logout" variant="outline" onPress={handleLogout} />
    </ScreenContainer>
  );
}

function SettingsRow({
  iconName,
  title,
  value,
  onPress,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.navRow} onPress={onPress}>
      <View style={styles.navIcon}>
        <MaterialCommunityIcons name={iconName} size={21} color={Colors.light.tint} />
      </View>
      <View style={styles.navText}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.light.muted} />
    </Pressable>
  );
}

function ToggleRow({ title, value, onChange }: { title: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: Colors.light.tint, false: Colors.light.border }} />
    </View>
  );
}

const styles = StyleSheet.create({
  navIcon: {
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  navRow: {
    alignItems: 'center',
    borderBottomColor: Colors.light.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  navText: {
    flex: 1,
  },
  navTitle: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '900',
  },
  navValue: {
    color: Colors.light.muted,
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 8,
  },
  toggleRow: {
    alignItems: 'center',
    borderBottomColor: Colors.light.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleTitle: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '800',
  },
});
