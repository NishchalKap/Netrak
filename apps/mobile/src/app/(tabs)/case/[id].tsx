import React, { useEffect, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { EvidenceList } from '@/components/evidence/EvidenceList';
import { useCaseStore } from '@/store/caseStore';
import { CaseStatus } from '@/types';
import { formatDateTime, getIncidentCategoryLabel, getRiskLabel, getStatusLabel } from '@/utils';
import { useAppTheme } from '@/hooks/useAppTheme';

const nextStatus: Record<CaseStatus, CaseStatus> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'ESCALATED',
  ESCALATED: 'CLOSED',
  CLOSED: 'CLOSED',
};

export default function CaseDetailsScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ id?: string }>();
  const caseId = params.id ?? '';
  const cases = useCaseStore((state) => state.cases);
  const selectedCase = useCaseStore((state) => state.selectedCase);
  const fetchCaseById = useCaseStore((state) => state.fetchCaseById);
  const updateCase = useCaseStore((state) => state.updateCase);
  const deleteCase = useCaseStore((state) => state.deleteCase);
  const isLoading = useCaseStore((state) => state.isLoading);
  const isMutating = useCaseStore((state) => state.isMutating);
  const error = useCaseStore((state) => state.error);
  const mutationError = useCaseStore((state) => state.mutationError);
  const source = useCaseStore((state) => state.source);
  const lastSyncedAt = useCaseStore((state) => state.lastSyncedAt);
  const caseItem = selectedCase?.id === caseId
    ? selectedCase
    : cases.find((item) => item.id === caseId) ?? null;

  useEffect(() => {
    if (caseId) void fetchCaseById(caseId);
  }, [caseId, fetchCaseById]);

  const nextAction = useMemo(() => {
    if (!caseItem || caseItem.status === 'CLOSED') return null;
    const status = nextStatus[caseItem.status];
    return { status, label: `Mark ${getStatusLabel(status)}` };
  }, [caseItem]);

  const handleStatusUpdate = async () => {
    if (!caseItem || !nextAction) return;
    await updateCase(caseItem.id, { status: nextAction.status });
  };

  const handleDelete = () => {
    if (!caseItem) return;
    Alert.alert(
      'Delete this case?',
      'This permanently removes the case and its evidence references. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete case',
          style: 'destructive',
          onPress: async () => {
            if (await deleteCase(caseItem.id)) router.replace('/(tabs)/history');
          },
        },
      ]
    );
  };

  const back = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.back()}
    >
      <MaterialCommunityIcons name="arrow-left" size={21} color={colors.text} />
    </Pressable>
  );

  if (isLoading && !caseItem) {
    return <ScreenContainer>{back}<SkeletonList count={2} /></ScreenContainer>;
  }

  if (!caseItem) {
    return (
      <ScreenContainer>
        {back}
        <SyncStatus error={error} onRetry={() => { void fetchCaseById(caseId); }} />
        <EmptyState
          iconName="folder-alert-outline"
          title={error ? 'Case unavailable' : 'Case not found'}
          message={error ?? 'The selected case is unavailable or no longer accessible.'}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      scroll
      refreshing={isLoading}
      onRefresh={() => { void fetchCaseById(caseId); }}
    >
      {back}
      <SyncStatus
        error={error}
        cached={source === 'cached'}
        lastSyncedAt={lastSyncedAt}
        onRetry={() => { void fetchCaseById(caseId); }}
      />
      <Text style={[styles.eyebrow, { color: colors.tint }]}>CASE FILE / {caseItem.id.slice(-8).toUpperCase()}</Text>
      <Typography variant="h1" style={styles.title}>{caseItem.title}</Typography>
      <View style={styles.badges}>
        <StatusBadge value={caseItem.status} />
        <StatusBadge value={caseItem.riskLevel ?? 'medium'} />
      </View>
      <Card style={styles.summary}>
        <Text style={[styles.description, { color: colors.text }]}>{caseItem.description}</Text>
        <View style={[styles.metaLine, { borderTopColor: colors.border }]}>
          <Meta icon="tag-outline" label="Category" value={getIncidentCategoryLabel(caseItem.category)} colors={colors} />
          <Meta icon="map-marker-outline" label="Location" value={caseItem.location ?? 'Pending'} colors={colors} />
        </View>
      </Card>
      <Button
        title="Add evidence"
        iconName="paperclip"
        onPress={() => router.push({ pathname: '/(tabs)/upload', params: { caseId: caseItem.id } })}
      />
      {nextAction && (
        <Button
          title={nextAction.label}
          iconName="progress-check"
          variant="outline"
          loading={isMutating}
          onPress={handleStatusUpdate}
        />
      )}
      {mutationError && <Text accessibilityRole="alert" style={[styles.actionError, { color: colors.danger }]}>{mutationError}</Text>}
      <SectionHeader title="Case timeline" />
      <View style={styles.timeline}>
        {(caseItem.timeline ?? []).map((event, index) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.rail}>
              <View style={[styles.timelineDot, { backgroundColor: index === 0 ? colors.tint : colors.muted }]} />
              {index < (caseItem.timeline?.length ?? 0) - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
            </View>
            <View style={[styles.timelineContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.timelineTitle, { color: colors.text }]}>{event.title}</Text>
              <Text style={[styles.timelineDetail, { color: colors.muted }]}>{event.detail}</Text>
              <Text style={[styles.timelineDate, { color: colors.muted }]}>{formatDateTime(event.createdAt)}</Text>
            </View>
          </View>
        ))}
      </View>
      <SectionHeader title="Evidence" />
      <EvidenceList evidence={caseItem.evidence ?? []} />
      <SectionHeader title="Case details" />
      <Card>
        <Meta icon="shield-outline" label="Risk level" value={getRiskLabel(caseItem.riskLevel)} colors={colors} />
        <Meta icon="clock-outline" label="Last updated" value={formatDateTime(caseItem.updatedAt)} colors={colors} />
      </Card>
      <Button
        title="Delete case"
        iconName="trash-can-outline"
        variant="danger"
        disabled={isMutating}
        onPress={handleDelete}
      />
    </ScreenContainer>
  );
}

function Meta({ icon, label, value, colors }: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  return (
    <View style={styles.meta}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.tint} />
      <View>
        <Text style={[styles.metaLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.metaValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionError: { fontSize: 13, fontWeight: '700', marginTop: 6 },
  backButton: { alignItems: 'center', borderRadius: 14, borderWidth: 1, height: 44, justifyContent: 'center', marginBottom: 20, width: 44 },
  badges: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  description: { fontSize: 16, lineHeight: 24 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
  meta: { alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 14 },
  metaLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  metaLine: { flexDirection: 'row', gap: 28, marginTop: 20, paddingTop: 4 },
  metaValue: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  rail: { alignItems: 'center', width: 10 },
  summary: { marginBottom: 12 },
  timeline: { gap: 0 },
  timelineContent: { borderRadius: 16, borderWidth: 1, flex: 1, marginBottom: 12, padding: 14 },
  timelineDate: { fontSize: 11, marginTop: 7 },
  timelineDetail: { fontSize: 13, lineHeight: 19, marginTop: 4 },
  timelineDot: { borderRadius: 5, height: 10, width: 10 },
  timelineItem: { flexDirection: 'row', gap: 12 },
  timelineLine: { flex: 1, marginLeft: 4, marginTop: 5, width: 2 },
  timelineTitle: { fontSize: 14, fontWeight: '700' },
  title: { marginBottom: 8 },
});
