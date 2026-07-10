import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useUserStore } from '@/store/userStore';
import { Colors } from '@/constants';

export default function ProfileScreen() {
  const { profile, fetchProfile, updateLocalProfile, isLoading } = useUserStore();
  const [name, setName] = useState(profile?.name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [district, setDistrict] = useState(profile?.district ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [fetchProfile, profile]);

  const saveProfile = () => {
    updateLocalProfile({
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      district: district.trim() || undefined,
    });
    setSaved(true);
  };

  return (
    <ScreenContainer scroll>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.light.text} />
      </Pressable>

      <Typography variant="h1">Profile</Typography>

      <Card style={styles.identityCard}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account-outline" size={34} color={Colors.light.tint} />
        </View>
        <View style={styles.identityText}>
          <Text style={styles.name}>{profile?.name || profile?.email || 'Citizen User'}</Text>
          <Text style={styles.email}>{profile?.email ?? 'Offline demo profile'}</Text>
          <StatusBadge value="low" />
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Full name" />
        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad" />
        <Input label="District" value={district} onChangeText={setDistrict} placeholder="Home district" />
        {saved && <Text style={styles.saved}>Profile saved locally.</Text>}
        <Button title="Save profile" iconName="content-save-outline" loading={isLoading} onPress={saveProfile} />
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Role</Text>
          <Text style={styles.rowValue}>{profile?.role ?? 'CITIZEN'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Verification</Text>
          <Text style={styles.rowValue}>Basic</Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
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
  email: {
    color: Colors.light.muted,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 2,
  },
  identityCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  identityText: {
    flex: 1,
  },
  name: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '900',
  },
  row: {
    alignItems: 'center',
    borderTopColor: Colors.light.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLabel: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  rowValue: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '900',
  },
  saved: {
    color: Colors.light.success,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
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
});
