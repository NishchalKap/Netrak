import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants';
import { useCaseStore } from '@/store/caseStore';
import { useNotificationStore } from '@/store/notificationStore';
import { EvidenceType } from '@/types';

const evidenceTypes: EvidenceType[] = ['image', 'audio', 'video', 'document', 'chat', 'link', 'note'];

export default function UploadFlowScreen() {
  const params = useLocalSearchParams<{ caseId?: string }>();
  const cases = useCaseStore((state) => state.cases);
  const addEvidence = useCaseStore((state) => state.addEvidence);
  const addLocalNotification = useNotificationStore((state) => state.addLocalNotification);
  const initialCaseId = params.caseId && cases.some((caseItem) => caseItem.id === params.caseId) ? params.caseId : cases[0]?.id;
  const [caseId, setCaseId] = useState(initialCaseId ?? '');
  const [type, setType] = useState<EvidenceType>('image');
  const [label, setLabel] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedCase = useMemo(() => cases.find((caseItem) => caseItem.id === caseId) ?? null, [caseId, cases]);

  const submitEvidence = () => {
    if (!selectedCase) {
      setError('Choose a case before uploading evidence.');
      return;
    }
    if (label.trim().length < 3) {
      setError('Add an evidence label.');
      return;
    }
    if (reference.trim().length < 3) {
      setError('Add a file name, link, transaction ID, or reference.');
      return;
    }

    const evidence = addEvidence(selectedCase.id, {
      type,
      label: label.trim(),
      reference: reference.trim(),
      notes: notes.trim() || undefined,
    });

    if (evidence) {
      addLocalNotification(`Evidence added: ${evidence.label}`, 'case');
      router.push({ pathname: '/(tabs)/case/[id]', params: { id: selectedCase.id } });
    }
  };

  if (!cases.length) {
    return (
      <ScreenContainer>
        <Typography variant="h1">Upload Evidence</Typography>
        <EmptyState iconName="folder-plus-outline" title="No case available" message="Create a report before attaching evidence." />
        <Button title="Create report" iconName="file-alert-outline" onPress={() => router.push('/(tabs)/report')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Typography variant="h1">Upload Evidence</Typography>
      <Text style={styles.subtitle}>Attach a reference to an existing report.</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Case</Text>
        <View style={styles.caseList}>
          {cases.slice(0, 5).map((caseItem) => (
            <Pressable
              key={caseItem.id}
              style={[styles.caseOption, caseId === caseItem.id && styles.caseOptionSelected]}
              onPress={() => setCaseId(caseItem.id)}
            >
              <Text style={[styles.caseTitle, caseId === caseItem.id && styles.selectedText]} numberOfLines={1}>
                {caseItem.title}
              </Text>
              <Text style={[styles.caseStatus, caseId === caseItem.id && styles.selectedText]}>{caseItem.status}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Evidence Type</Text>
        <View style={styles.chips}>
          {evidenceTypes.map((item) => {
            const selected = type === item;
            return (
              <Pressable key={item} style={[styles.chip, selected && styles.chipSelected]} onPress={() => setType(item)}>
                <Text style={[styles.chipText, selected && styles.selectedText]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.section}>
        <Input label="Label" value={label} placeholder="Screenshot of forged warrant" onChangeText={setLabel} />
        <Input
          label="Reference"
          value={reference}
          placeholder="File name, URL, transaction ID, or chat export"
          onChangeText={setReference}
        />
        <Input
          label="Notes"
          value={notes}
          placeholder="Context, sender, time, or handling notes"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          onChangeText={setNotes}
          style={styles.notes}
        />
      </Card>

      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Attach evidence" iconName="paperclip" onPress={submitEvidence} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  caseList: {
    gap: 8,
  },
  caseOption: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  caseOptionSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  caseStatus: {
    color: Colors.light.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  caseTitle: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '800',
  },
  chip: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: Colors.light.info,
    borderColor: Colors.light.info,
  },
  chipText: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  error: {
    color: Colors.light.danger,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  notes: {
    minHeight: 96,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.light.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  selectedText: {
    color: '#ffffff',
  },
  subtitle: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 14,
  },
});
