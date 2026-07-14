import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { authApi } from '@/services/authApi';
import { User } from '@/types';

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const { profile, fetchProfile, isLoading, error } = useUserStore();

  useEffect(() => {
    if (!profile) void fetchProfile();
  }, [fetchProfile, profile]);

  return (
    <ScreenContainer scroll refreshing={isLoading} onRefresh={() => { void fetchProfile(); }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
      </Pressable>

      <Typography variant="h1">Profile</Typography>

      <Card style={styles.identityCard}>
        <View style={[styles.avatar, { backgroundColor: `${colors.tint}18`, borderColor: `${colors.tint}40` }]}>
          <MaterialCommunityIcons name="account-outline" size={34} color={colors.tint} />
        </View>
        <View style={styles.identityText}>
          <Text style={[styles.name, { color: colors.text }]}>{profile?.name || profile?.email || 'Citizen User'}</Text>
          <Text style={[styles.email, { color: colors.muted }]}>{profile?.email ?? 'Profile unavailable'}</Text>
          <StatusBadge value="low" />
        </View>
      </Card>

      {isLoading && !profile ? (
        <SkeletonList count={2} />
      ) : profile ? (
        <ProfileEditor profile={profile} />
      ) : (
        <Card>
          <Text accessibilityRole="alert" style={[styles.saved, { color: colors.danger }]}>{error ?? 'Profile is unavailable.'}</Text>
          <Button title="Retry" iconName="refresh" variant="outline" onPress={() => { void fetchProfile(); }} />
        </Card>
      )}
    </ScreenContainer>
  );
}

function ProfileEditor({ profile }: { profile: User }) {
  const { colors } = useAppTheme();
  const { updateProfile, isSaving, error } = useUserStore();
  const [name, setName] = useState(profile.name ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [district, setDistrict] = useState(profile.district ?? '');
  const [saved, setSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const saveProfile = async () => {
    const normalizedPhone = phone.replace(/[\s()-]/g, '');
    if (normalizedPhone && !/^\+?\d{7,15}$/.test(normalizedPhone)) {
      setValidationError('Enter a valid phone number with 7 to 15 digits.');
      return;
    }
    setValidationError(null);
    setSaved(false);
    const updated = await updateProfile({
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      district: district.trim() || undefined,
    });
    setSaved(Boolean(updated));
  };

  const resetPassword = async () => {
    setIsResettingPassword(true);
    try {
      await authApi.forgotPassword(profile.email);
      Alert.alert('Reset instructions requested', 'If this account can receive email, password reset instructions will be sent shortly.');
    } catch {
      Alert.alert('Unable to request reset', 'Check your connection and try again.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <>
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Full name" />
        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad" />
        <Input label="District" value={district} onChangeText={setDistrict} placeholder="Home district" />
        {saved && <Text accessibilityLiveRegion="polite" style={[styles.saved, { color: colors.success }]}>Profile saved.</Text>}
        {(validationError || error) && <Text accessibilityRole="alert" style={[styles.saved, { color: colors.danger }]}>{validationError || error}</Text>}
        <Button title="Save profile" iconName="content-save-outline" loading={isSaving} onPress={() => { void saveProfile(); }} />
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        <View style={[styles.row, { borderTopColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>Role</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>{profile.role}</Text>
        </View>
        <View style={[styles.row, { borderTopColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>Verification</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>Basic</Text>
        </View>
        <Button
          title="Send password reset instructions"
          iconName="lock-reset"
          variant="outline"
          loading={isResettingPassword}
          onPress={() => { void resetPassword(); }}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', borderRadius: 18, borderWidth: 1, height: 64, justifyContent: 'center', width: 64 },
  backButton: { alignItems: 'center', borderRadius: 14, borderWidth: 1, height: 42, justifyContent: 'center', marginBottom: 12, width: 42 },
  email: { fontSize: 13, marginBottom: 8, marginTop: 2 },
  identityCard: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 12 },
  identityText: { flex: 1 },
  name: { fontSize: 18, fontWeight: '900' },
  row: { alignItems: 'center', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  rowLabel: { fontSize: 14, fontWeight: '700' },
  rowValue: { fontSize: 14, fontWeight: '900' },
  saved: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '900', marginBottom: 8 },
});
