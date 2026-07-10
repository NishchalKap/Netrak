import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CaseListItem } from '@/components/cases/CaseListItem';
import { ThreatCard } from '@/components/threats/ThreatCard';
import { useCaseStore } from '@/store/caseStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { threatFeed } from '@/data/threatFeed';
import { Colors } from '@/constants';

export default function DashboardScreen() {
  const { cases, fetchCases } = useCaseStore();
  const { notifications, fetchNotifications } = useNotificationStore();
  const { profile, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchCases();
    fetchNotifications();
    if (!profile) fetchProfile();
  }, [fetchCases, fetchNotifications, fetchProfile, profile]);

  const stats = useMemo(() => {
    const activeCases = cases.filter((caseItem) => caseItem.status !== 'CLOSED').length;
    const escalatedCases = cases.filter((caseItem) => caseItem.status === 'ESCALATED').length;
    const unreadAlerts = notifications.filter((notification) => !notification.read).length;

    return { activeCases, escalatedCases, unreadAlerts };
  }, [cases, notifications]);

  const recentCases = cases.slice(0, 2);
  const latestThreat = threatFeed[0];

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <View>
          <Typography variant="h1" style={styles.title}>
            Citizen Dashboard
          </Typography>
          <Text style={styles.subtitle}>{profile?.district ?? 'Netrak shield'} jurisdiction</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={() => router.push('/(tabs)/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={23} color={Colors.light.text} />
          {stats.unreadAlerts > 0 && <View style={styles.notificationDot} />}
        </Pressable>
      </View>

      <Card tone="danger" style={styles.sosCard}>
        <View style={styles.sosCopy}>
          <Text style={styles.sosTitle}>Emergency SOS</Text>
          <Text style={styles.sosText}>Active coercion, digital arrest, or live transfer pressure.</Text>
        </View>
        <Button title="SOS" iconName="alarm-light-outline" variant="danger" onPress={() => router.push('/(tabs)/sos')} />
      </Card>

      <View style={styles.statsGrid}>
        <StatCard label="Active cases" value={String(stats.activeCases)} iconName="folder-open-outline" tone="info" />
        <StatCard label="Escalated" value={String(stats.escalatedCases)} iconName="alert-octagon-outline" tone="danger" />
      </View>
      <View style={styles.statsGrid}>
        <StatCard label="Unread alerts" value={String(stats.unreadAlerts)} iconName="bell-badge-outline" tone="warning" />
        <StatCard label="Threat level" value="High" iconName="radar" tone="violet" />
      </View>

      <SectionHeader
        title="Quick Actions"
        action={
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.link}>Profile</Text>
          </Pressable>
        }
      />
      <View style={styles.actions}>
        <Button title="Report Incident" iconName="file-alert-outline" onPress={() => router.push('/(tabs)/report')} />
        <Button title="Upload Evidence" iconName="file-upload-outline" variant="outline" onPress={() => router.push('/(tabs)/upload')} />
      </View>

      <SectionHeader title="Latest Threat" />
      <ThreatCard threat={latestThreat} />

      <SectionHeader
        title="Recent Reports"
        action={
          <Pressable onPress={() => router.push('/(tabs)/history')}>
            <Text style={styles.link}>View all</Text>
          </Pressable>
        }
      />
      {recentCases.map((caseItem) => (
        <CaseListItem
          key={caseItem.id}
          item={caseItem}
          onPress={() => router.push({ pathname: '/(tabs)/case/[id]', params: { id: caseItem.id } })}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 8,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    position: 'relative',
    width: 44,
  },
  link: {
    color: Colors.light.tint,
    fontSize: 13,
    fontWeight: '800',
  },
  notificationDot: {
    backgroundColor: Colors.light.danger,
    borderRadius: 5,
    height: 10,
    position: 'absolute',
    right: 9,
    top: 9,
    width: 10,
  },
  sosCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sosCopy: {
    flex: 1,
  },
  sosText: {
    color: Colors.light.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  sosTitle: {
    color: Colors.light.danger,
    fontSize: 17,
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  subtitle: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    marginBottom: 0,
  },
});
