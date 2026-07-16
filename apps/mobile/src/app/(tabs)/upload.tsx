import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { useCaseStore } from '@/store/caseStore';
import { EvidenceType } from '@/types';
import { useAppTheme } from '@/hooks/useAppTheme';

const evidenceTypes: EvidenceType[] = ['image', 'audio', 'video', 'document', 'chat', 'link', 'note'];

export default function UploadFlowScreen() {
  const { colors } = useAppTheme();
  const params = useLocalSearchParams<{ caseId?: string }>();
  const cases = useCaseStore((state) => state.cases);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const addEvidence = useCaseStore((state) => state.addEvidence);
  const isLoading = useCaseStore((state) => state.isLoading);
  const isMutating = useCaseStore((state) => state.isMutating);
  const fetchError = useCaseStore((state) => state.error);
  const mutationError = useCaseStore((state) => state.mutationError);
  const source = useCaseStore((state) => state.source);
  const lastSyncedAt = useCaseStore((state) => state.lastSyncedAt);
  const [caseId, setCaseId] = useState(params.caseId ?? '');
  const [type, setType] = useState<EvidenceType>('image');
  const [label, setLabel] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cases.length) void fetchCases();
  }, [cases.length, fetchCases]);

  const resolvedCaseId = cases.some((item) => item.id === caseId)
    ? caseId
    : params.caseId && cases.some((item) => item.id === params.caseId)
      ? params.caseId
      : cases[0]?.id ?? '';

  const selectedCase = useMemo(
    () => cases.find((caseItem) => caseItem.id === resolvedCaseId) ?? null,
    [resolvedCaseId, cases]
  );

  const submitEvidence = async () => {
    if (!selectedCase) return setError('Choose a case before attaching evidence.');
    if (label.trim().length < 3) return setError('Add a clear evidence label.');
    if (reference.trim().length < 3) return setError('Add a file name, link, transaction ID, or reference.');
    setError(null);
    const evidence = await addEvidence(selectedCase.id, {
      type,
      label: label.trim(),
      reference: reference.trim(),
      notes: notes.trim() || undefined,
    });
    if (evidence) router.push({ pathname: '/(tabs)/case/[id]', params: { id: selectedCase.id } });
  };

  if (isLoading && !cases.length) {
    return <ScreenContainer><Typography variant="h1">Add evidence reference</Typography><SkeletonList count={2} /></ScreenContainer>;
  }

  if (!cases.length) {
    return (
      <ScreenContainer>
        <Typography variant="h1">Add evidence reference</Typography>
        <SyncStatus error={fetchError} onRetry={() => { void fetchCases(true); }} />
        <EmptyState
          iconName="folder-plus-outline"
          title={fetchError ? 'Cases unavailable' : 'Start with a report'}
          message={fetchError ?? 'Create a report before attaching evidence.'}
        />
        <Button title="Create report" iconName="file-alert-outline" onPress={() => router.push('/(tabs)/report')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll refreshing={isLoading} onRefresh={() => { void fetchCases(true); }}>
      <Text style={[styles.eyebrow, { color: colors.tint }]}>CASE SUPPORT</Text>
      <Typography variant="h1">Add evidence reference</Typography>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Metadata references are attached to a case for review. Add only information that helps explain what happened.</Text>
      <SyncStatus
        error={fetchError}
        cached={source === 'cached'}
        lastSyncedAt={lastSyncedAt}
        onRetry={() => { void fetchCases(true); }}
      />
      <View style={styles.steps}>
        {['Choose', 'Describe', 'Attach'].map((step, index) => (
          <View key={step} style={styles.step}>
            <View style={[styles.stepDot, { backgroundColor: index === 2 ? colors.tint : colors.surfaceMuted }]}>
              <Text style={[styles.stepText, { color: index === 2 ? colors.background : colors.muted }]}>{index + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, { color: index === 2 ? colors.text : colors.muted }]}>{step}</Text>
          </View>
        ))}
      </View>
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Attach to case</Text>
        <View style={styles.caseList}>
          {cases.slice(0, 5).map((caseItem) => {
            const selected = resolvedCaseId === caseItem.id;
            return (
              <Pressable
                key={caseItem.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                style={[styles.caseOption, { backgroundColor: selected ? colors.surfaceMuted : colors.surface, borderColor: selected ? colors.tint : colors.border }]}
                onPress={() => setCaseId(caseItem.id)}
              >
                <View style={styles.caseCopy}>
                  <Text style={[styles.caseTitle, { color: colors.text }]} numberOfLines={1}>{caseItem.title}</Text>
                  <Text style={[styles.caseStatus, { color: colors.muted }]}>{caseItem.status.replace('_', ' ')}</Text>
                </View>
                {selected && <MaterialCommunityIcons name="check-circle" color={colors.tint} size={20} />}
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Card style={styles.section}>
        <View style={styles.capabilityRow}>
          <MaterialCommunityIcons name="information-outline" size={22} color={colors.tint} />
          <View style={styles.capabilityCopy}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>File transfer is future scope</Text>
            <Text style={[styles.capabilityText, { color: colors.muted }]}>The current gateway accepts evidence metadata, not file binaries. Record a filename, transaction ID, or approved HTTPS evidence-system link below. Device files are never presented as uploaded.</Text>
          </View>
        </View>
      </Card>
      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Evidence type</Text>
        <View style={styles.chips}>
          {evidenceTypes.map((item) => {
            const selected = type === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                style={[styles.chip, { backgroundColor: selected ? colors.surfaceMuted : colors.surface, borderColor: selected ? colors.tint : colors.border }]}
                onPress={() => setType(item)}
              >
                <Text style={[styles.chipText, { color: selected ? colors.tint : colors.text }]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>
      <Card style={styles.section}>
        <Input label="Evidence label" value={label} placeholder="Screenshot of forged warrant" onChangeText={setLabel} />
        <Input label="Reference" value={reference} placeholder="File name, URL, transaction ID, or chat export" onChangeText={setReference} />
        <Input label="Handling notes" value={notes} placeholder="Context, sender, time, or handling notes" multiline numberOfLines={4} textAlignVertical="top" onChangeText={setNotes} style={styles.notes} />
      </Card>
      {(error || mutationError) && <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error || mutationError}</Text>}
      <Button title="Attach reference" iconName="paperclip" loading={isMutating} onPress={submitEvidence} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  caseCopy: { flex: 1 },
  capabilityCopy: { flex: 1 },
  capabilityRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 12 },
  capabilityText: { fontSize: 13, lineHeight: 19 },
  caseList: { gap: 8 },
  caseOption: { alignItems: 'center', borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 10, padding: 13 },
  caseStatus: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginTop: 4, textTransform: 'uppercase' },
  caseTitle: { fontSize: 14, fontWeight: '700' },
  chip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  chipText: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  error: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9 },
  notes: { minHeight: 96 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  step: { alignItems: 'center', flex: 1, gap: 6 },
  stepDot: { alignItems: 'center', borderRadius: 12, height: 24, justifyContent: 'center', width: 24 },
  stepLabel: { fontSize: 11, fontWeight: '600' },
  stepText: { fontSize: 11, fontWeight: '800' },
  steps: { flexDirection: 'row', marginBottom: 24, marginTop: 3 },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: 22 },
});
