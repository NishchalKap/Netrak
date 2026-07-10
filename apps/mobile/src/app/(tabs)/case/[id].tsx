import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { EvidenceList } from '@/components/evidence/EvidenceList';
import { useCaseStore } from '@/store/caseStore';
import { useNotificationStore } from '@/store/notificationStore';
import { CaseStatus } from '@/types';
import { Colors } from '@/constants';
import { formatDateTime, getIncidentCategoryLabel, getRiskLabel, getStatusLabel } from '@/utils';

const nextStatus: Record<CaseStatus, CaseStatus> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'ESCALATED',
  ESCALATED: 'CLOSED',
  CLOSED: 'CLOSED',
};

export default function CaseDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const caseId = params.id ?? '';
  const { cases, selectedCase, fetchCaseById, updateCase } = useCaseStore();
  const addLocalNotification = useNotificationStore((state) => state.addLocalNotification);
  const caseItem = selectedCase?.id === caseId ? selectedCase : cases.find((item) => item.id === caseId) ?? null;

  useEffect(() => {
    if (caseId) fetchCaseById(caseId);
  }, [caseId, fetchCaseById]);

  const nextAction = useMemo(() => {
    if (!caseItem || caseItem.status === 'CLOSED') return null;
    const next = nextStatus[caseItem.status];
    return { status: next, label: `Mark ${getStatusLabel(next)}` };
  }, [caseItem]);

  const handleStatusUpdate = async () => {
    if (!caseItem || !nextAction) return;
    const updated = await updateCase(caseItem.id, { status: nextAction.status });
    if (updated) addLocalNotification(`Case updated: ${getStatusLabel(updated.status)}`, 'case');
  };

  if (!caseItem) {
    return (
      <ScreenContainer>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.light.text} />
        </Pressable>
        <EmptyState iconName="folder-alert-outline" title="Case not found" message="The selected case is unavailable." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.light.text} />
      </Pressable>

      <Typography variant="h1">{caseItem.title}</Typography>
      <View style={styles.badges}>
        <StatusBadge value={caseItem.status} />
        <StatusBadge value={caseItem.riskLevel ?? 'medium'} />
      </View>

      <Card style={styles.section}>
        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{getIncidentCategoryLabel(caseItem.category)}</Text>
        <Text style={styles.label}>Risk</Text>
        <Text style={styles.value}>{getRiskLabel(caseItem.riskLevel)}</Text>
        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{caseItem.location ?? 'Location pending'}</Text>
        <Text style={styles.label}>Updated</Text>
        <Text style={styles.value}>{formatDateTime(caseItem.updatedAt)}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.description}>{caseItem.description}</Text>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Upload Evidence"
          iconName="file-upload-outline"
          onPress={() => router.push({ pathname: '/(tabs)/upload', params: { caseId: caseItem.id } })}
        />
        {nextAction && (
          <Button title={nextAction.label} iconName="progress-check" variant="outline" onPress={handleStatusUpdate} />
        )}
      </View>

      <SectionHeader title="Evidence" />
      <EvidenceList evidence={caseItem.evidence ?? []} />

      <SectionHeader title="Timeline" />
      <View style={styles.timeline}>
        {(caseItem.timeline ?? []).map((event) => (
          <View key={event.id} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>{event.title}</Text>
              <Text style={styles.timelineDetail}>{event.detail}</Text>
              <Text style={styles.timelineDate}>{formatDateTime(event.createdAt)}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 8,
    marginBottom: 10,
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
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  description: {
    color: Colors.light.text,
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: Colors.light.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 12,
  },
  timeline: {
    gap: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    color: Colors.light.muted,
    fontSize: 12,
    marginTop: 3,
  },
  timelineDetail: {
    color: Colors.light.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3,
  },
  timelineDot: {
    backgroundColor: Colors.light.tint,
    borderRadius: 6,
    height: 12,
    marginTop: 4,
    width: 12,
  },
  timelineItem: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  timelineTitle: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '800',
  },
  value: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
});
