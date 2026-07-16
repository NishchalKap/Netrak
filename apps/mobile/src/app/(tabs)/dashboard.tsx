import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { CaseListItem } from '@/components/cases/CaseListItem';
import { useCaseStore } from '@/store/caseStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { EmptyState } from '@/components/ui/EmptyState';

export default function DashboardScreen() {
  const { colors } = useAppTheme();
  const cases = useCaseStore((state) => state.cases);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const isLoading = useCaseStore((state) => state.isLoading);
  const error = useCaseStore((state) => state.error);
  const source = useCaseStore((state) => state.source);
  const lastSyncedAt = useCaseStore((state) => state.lastSyncedAt);
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const notificationsLoading = useNotificationStore((state) => state.isLoading);
  const profile = useUserStore((state) => state.profile);
  const fetchProfile = useUserStore((state) => state.fetchProfile);

  useEffect(() => { fetchCases(); fetchNotifications(); if (!profile) fetchProfile(); }, [fetchCases, fetchNotifications, fetchProfile, profile]);

  const overview = useMemo(() => ({
    active: cases.filter((item) => item.status !== 'CLOSED').length,
    unread: notifications.filter((item) => !item.read).length,
  }), [cases, notifications]);
  const firstName = profile?.name?.split(' ')[0] || 'there';
  const serviceState = source === 'online'
    ? { label: 'CONNECTED', title: 'Ready', detail: 'Your case records are synchronized.', color: colors.success }
    : source === 'cached'
      ? { label: 'CACHED', title: 'Offline view', detail: 'Showing the most recent records stored on this device.', color: colors.warning }
      : error
        ? { label: 'UNAVAILABLE', title: 'Connection needed', detail: 'Some services could not be refreshed.', color: colors.danger }
        : { label: 'CHECKING', title: 'Connecting', detail: 'Checking Netrak service availability.', color: colors.muted };

  return (
    <ScreenContainer scroll refreshing={(isLoading || notificationsLoading) && (cases.length > 0 || notifications.length > 0)} onRefresh={() => { fetchCases(true); fetchNotifications(true); }} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: colors.tint }]}>NETRAK / {profile?.role ?? 'CITIZEN'}</Text>
          <Typography variant="h1" style={styles.greeting}>Good morning, {firstName}.</Typography>
          <Text style={[styles.subhead, { color: colors.muted }]}>Clear reporting and recovery support.</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open notifications" style={[styles.bell, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/(tabs)/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={colors.text} />
          {overview.unread > 0 && <View style={[styles.dot, { backgroundColor: colors.tint, borderColor: colors.surface }]} />}
        </Pressable>
      </View>

      <SyncStatus error={error} cached={source === 'cached'} lastSyncedAt={lastSyncedAt} onRetry={() => fetchCases(true)} />

      <Card style={[styles.threatCard, { backgroundColor: colors.surface, borderColor: `${colors.tint}38` }]}>
        <View style={styles.cardTopline}><Text style={[styles.label, { color: colors.muted }]}>NETRAK SERVICE STATUS</Text><View style={styles.secure}><View style={[styles.secureDot, { backgroundColor: serviceState.color }]} /><Text style={[styles.secureText, { color: serviceState.color }]}>{serviceState.label}</Text></View></View>
        <View style={styles.threatBody}>
          <View><Text style={[styles.threatNumber, { color: colors.text }]}>{serviceState.title}</Text><Text style={[styles.threatText, { color: colors.muted }]}>{serviceState.detail}</Text></View>
          <View style={[styles.ring, { backgroundColor: `${serviceState.color}14`, borderColor: `${serviceState.color}4D` }]}><MaterialCommunityIcons name="shield-check-outline" size={31} color={serviceState.color} /></View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.advisory, { color: colors.muted }]}><Text style={[styles.advisoryStrong, { color: colors.text }]}>Security advisory · </Text>Never share an OTP or transfer money to verify your identity.</Text>
      </Card>

      <View style={styles.actionRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Report fraud" style={[styles.action, styles.actionPrimary, { backgroundColor: colors.tint, borderColor: colors.tint }]} onPress={() => router.push('/(tabs)/report')}>
          <MaterialCommunityIcons name="file-document-edit-outline" size={21} color={colors.background} /><Text style={[styles.actionPrimaryText, { color: colors.background }]}>Report fraud</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Emergency SOS" style={[styles.action, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push('/(tabs)/sos')}>
          <MaterialCommunityIcons name="shield-alert-outline" size={21} color={colors.text} /><Text style={[styles.actionText, { color: colors.text }]}>Emergency SOS</Text>
        </Pressable>
      </View>

      <SectionHeader title="Your activity" />
      <View style={styles.metrics}>
        <Card style={styles.metric}><Text style={[styles.metricValue, { color: colors.text }]}>{overview.active}</Text><Text style={[styles.metricLabel, { color: colors.muted }]}>ACTIVE CASES</Text></Card>
        <Card style={styles.metric}><Text style={[styles.metricValue, { color: colors.text }]}>{overview.unread}</Text><Text style={[styles.metricLabel, { color: colors.muted }]}>NEW UPDATES</Text></Card>
      </View>

      <SectionHeader title="Recent cases" action={<Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/history')}><Text style={[styles.seeAll, { color: colors.tint }]}>View all</Text></Pressable>} />
      {isLoading && !cases.length ? <SkeletonList count={2} /> : cases.slice(0, 2).map((item) => <CaseListItem key={item.id} item={item} onPress={() => router.push({ pathname: '/(tabs)/case/[id]', params: { id: item.id } })} />)}
      {!isLoading && !cases.length && <EmptyState iconName="folder-outline" title="No active cases" message={error ? 'Cases could not be refreshed. Pull down to retry.' : 'Reports you submit will appear here.'} />}

      <Card style={styles.evidenceCard}>
        <View style={[styles.evidenceIcon, { backgroundColor: colors.surfaceMuted }]}><MaterialCommunityIcons name="cloud-upload-outline" size={22} color={colors.tint} /></View>
        <View style={styles.evidenceCopy}><Text style={[styles.evidenceTitle, { color: colors.text }]}>Keep evidence references ready</Text><Text style={[styles.evidenceText, { color: colors.muted }]}>Record secure links, filenames, transaction IDs, or handling notes on an open case.</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Add evidence" onPress={() => router.push('/(tabs)/upload')}><MaterialCommunityIcons name="arrow-top-right" size={21} color={colors.text} /></Pressable>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 44 }, header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 10 }, greeting: { maxWidth: 285, marginBottom: 5 }, subhead: { fontSize: 14, lineHeight: 20 }, bell: { alignItems: 'center', borderRadius: 14, borderWidth: 1, height: 48, justifyContent: 'center', width: 48 }, dot: { borderRadius: 5, borderWidth: 2, height: 10, position: 'absolute', right: 9, top: 9, width: 10 }, threatCard: { padding: 20 }, cardTopline: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, label: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }, secure: { alignItems: 'center', flexDirection: 'row', gap: 5 }, secureDot: { borderRadius: 3, height: 6, width: 6 }, secureText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.7 }, threatBody: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }, threatNumber: { fontSize: 27, fontWeight: '800', letterSpacing: -0.7 }, threatText: { fontSize: 13, marginTop: 4 }, ring: { alignItems: 'center', borderRadius: 28, borderWidth: 1, height: 56, justifyContent: 'center', width: 56 }, divider: { height: 1, marginVertical: 19 }, advisory: { fontSize: 12, lineHeight: 18 }, advisoryStrong: { fontWeight: '700' }, actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 }, action: { alignItems: 'center', borderRadius: 17, borderWidth: 1, flex: 1, gap: 8, justifyContent: 'center', minHeight: 92, paddingHorizontal: 8 }, actionPrimary: {}, actionText: { fontSize: 13, fontWeight: '700' }, actionPrimaryText: { fontSize: 13, fontWeight: '800' }, metrics: { flexDirection: 'row', gap: 10 }, metric: { flex: 1, minHeight: 105 }, metricValue: { fontSize: 31, fontWeight: '800', letterSpacing: -0.8 }, metricLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginTop: 8 }, seeAll: { fontSize: 13, fontWeight: '700' }, evidenceCard: { alignItems: 'center', flexDirection: 'row', gap: 13, marginTop: 4 }, evidenceIcon: { alignItems: 'center', borderRadius: 14, height: 46, justifyContent: 'center', width: 46 }, evidenceCopy: { flex: 1 }, evidenceTitle: { fontSize: 15, fontWeight: '700' }, evidenceText: { fontSize: 12, lineHeight: 17, marginTop: 3 },
});
