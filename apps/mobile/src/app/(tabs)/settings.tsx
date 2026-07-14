import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useThemeStore } from '@/store/themeStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useAuthStore } from '@/store/authStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { healthApi } from '@/services/healthApi';

type DiagnosticState = 'idle' | 'checking' | 'online' | 'offline';

export default function SettingsScreen() {
  const { colors, isDarkMode } = useAppTheme();
  const { mode, setMode } = useThemeStore();
  const {
    locationSharing,
    voiceAlerts,
    caseUpdateAlerts,
    threatAlerts,
    emergencyContact,
    preferredLanguage,
    compactMode,
    reduceMotion,
    setLocationSharing,
    setVoiceAlerts,
    setCaseUpdateAlerts,
    setThreatAlerts,
    setEmergencyContact,
    setPreferredLanguage,
    setCompactMode,
    setReduceMotion,
  } = useSettingsStore();
  const logout = useAuthStore((state) => state.logout);
  const [diagnostic, setDiagnostic] = useState<DiagnosticState>('idle');
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const runDiagnostics = async () => {
    setDiagnostic('checking');
    try {
      const result = await healthApi.check();
      setDiagnostic(result.status.toUpperCase() === 'UP' ? 'online' : 'offline');
    } catch {
      setDiagnostic('offline');
    }
  };

  const confirmLogout = () => {
    Alert.alert('Sign out of Netrak?', 'You will need your credentials to access your cases again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => { void logout(); } },
    ]);
  };

  return (
    <ScreenContainer scroll>
      <Text style={[styles.eyebrow, { color: colors.tint }]}>PREFERENCES</Text>
      <Typography variant="h1">Settings</Typography>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Control how Netrak supports and notifies you.</Text>

      <Card style={styles.section}>
        <SettingsRow iconName="account-circle-outline" title="Profile" value="Identity and home district" onPress={() => router.push('/(tabs)/profile')} colors={colors} />
        <SettingsRow iconName="bell-outline" title="Notifications" value="Alerts and case updates" onPress={() => router.push('/(tabs)/notifications')} colors={colors} />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>APPEARANCE</Text>
        <ToggleRow title="Follow device appearance" detail="Use your system light or dark setting" value={mode === 'system'} onChange={(enabled) => setMode(enabled ? 'system' : isDarkMode ? 'dark' : 'light')} colors={colors} />
        <ToggleRow title="Dark appearance" detail={mode === 'system' ? 'Controlled by device appearance' : 'Manual appearance override'} value={isDarkMode} onChange={(enabled) => setMode(enabled ? 'dark' : 'light')} colors={colors} />
        <ToggleRow title="Compact case cards" detail="Show more reports on screen" value={compactMode} onChange={setCompactMode} colors={colors} />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>ACCESSIBILITY</Text>
        <ToggleRow title="Reduce motion" detail="Disable page transition animations" value={reduceMotion} onChange={setReduceMotion} colors={colors} />
        <Text style={[styles.supportText, { color: colors.muted }]}>Netrak respects the text size and screen-reader settings configured on your device.</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>NOTIFICATIONS</Text>
        <ToggleRow title="Case updates" detail="Status and evidence activity" value={caseUpdateAlerts} onChange={setCaseUpdateAlerts} colors={colors} />
        <ToggleRow title="Threat advisories" detail="Important public-safety intelligence" value={threatAlerts} onChange={setThreatAlerts} colors={colors} />
        <ToggleRow title="Voice alerts" detail="Play critical status alerts" value={voiceAlerts} onChange={setVoiceAlerts} colors={colors} />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>EMERGENCY</Text>
        <ToggleRow title="Location sharing" detail="Use location on incident reports" value={locationSharing} onChange={setLocationSharing} colors={colors} />
        <Input label="Emergency contact" value={emergencyContact} keyboardType="phone-pad" onChangeText={setEmergencyContact} />
        <Button title="Open SOS" iconName="shield-alert-outline" variant="outline" onPress={() => router.push('/(tabs)/sos')} />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>LANGUAGE</Text>
        <Input label="Preferred language" value={preferredLanguage} onChangeText={setPreferredLanguage} />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>PRIVACY & INFORMATION</Text>
        <SettingsRow
          iconName="shield-lock-outline"
          title="Privacy"
          value="How incident data is handled"
          onPress={() => Alert.alert('Privacy', 'Incident and profile data is sent only to the configured Netrak service. Access and retention are governed by your organization deployment.')}
          colors={colors}
        />
        <SettingsRow
          iconName="file-document-outline"
          title="Terms"
          value="Service terms and responsibilities"
          onPress={() => Alert.alert('Terms', 'Use Netrak only for lawful public-safety reporting. Do not submit fabricated, unlawful, or unrelated material.')}
          colors={colors}
        />
        <SettingsRow
          iconName="information-outline"
          title="About Netrak"
          value={`Version ${version}`}
          onPress={() => Alert.alert('Netrak', `AI-powered digital public safety intelligence platform.\n\nVersion ${version}`)}
          colors={colors}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={[styles.groupLabel, { color: colors.muted }]}>DIAGNOSTICS</Text>
        <View style={styles.diagnosticRow} accessible accessibilityLiveRegion="polite">
          <View style={[styles.statusDot, { backgroundColor: diagnostic === 'online' ? colors.success : diagnostic === 'offline' ? colors.danger : colors.muted }]} />
          <Text style={[styles.diagnosticText, { color: colors.text }]}>
            {diagnostic === 'online' ? 'Netrak service is reachable' : diagnostic === 'offline' ? 'Netrak service is unreachable' : 'Service status not checked'}
          </Text>
        </View>
        <Button title="Run diagnostics" iconName="stethoscope" variant="outline" loading={diagnostic === 'checking'} onPress={() => { void runDiagnostics(); }} />
      </Card>

      <Button title="Sign out" iconName="logout" variant="ghost" onPress={confirmLogout} />
    </ScreenContainer>
  );
}

function SettingsRow({ iconName, title, value, onPress, colors }: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  value: string;
  onPress: () => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${value}`} style={[styles.navRow, { borderBottomColor: colors.border }]} onPress={onPress}>
      <View style={[styles.navIcon, { backgroundColor: colors.surfaceMuted }]}>
        <MaterialCommunityIcons name={iconName} size={20} color={colors.tint} />
      </View>
      <View style={styles.navText}>
        <Text style={[styles.navTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.navValue, { color: colors.muted }]}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={21} color={colors.muted} />
    </Pressable>
  );
}

function ToggleRow({ title, detail, value, onChange, colors }: {
  title: string;
  detail: string;
  value: boolean;
  onChange: (value: boolean) => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  return (
    <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
      <View style={styles.navText}>
        <Text style={[styles.navTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.navValue, { color: colors.muted }]}>{detail}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.tint, false: colors.border }}
        thumbColor={value ? colors.controlThumb : colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  diagnosticRow: { alignItems: 'center', flexDirection: 'row', gap: 9, paddingVertical: 12 },
  diagnosticText: { flex: 1, fontSize: 13, fontWeight: '600' },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9 },
  groupLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.9, marginBottom: 5 },
  navIcon: { alignItems: 'center', borderRadius: 13, height: 42, justifyContent: 'center', width: 42 },
  navRow: { alignItems: 'center', borderBottomWidth: 1, flexDirection: 'row', gap: 12, minHeight: 60, paddingVertical: 10 },
  navText: { flex: 1 },
  navTitle: { fontSize: 15, fontWeight: '600' },
  navValue: { fontSize: 12, marginTop: 3 },
  section: { marginBottom: 12 },
  statusDot: { borderRadius: 5, height: 10, width: 10 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  supportText: { fontSize: 12, lineHeight: 18, paddingVertical: 12 },
  toggleRow: { alignItems: 'center', borderBottomWidth: 1, flexDirection: 'row', gap: 16, justifyContent: 'space-between', minHeight: 62, paddingVertical: 10 },
});
