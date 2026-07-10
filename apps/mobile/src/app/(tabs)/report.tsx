import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { useCaseStore } from '@/store/caseStore';
import { useNotificationStore } from '@/store/notificationStore';
import { IncidentCategory, RiskLevel } from '@/types';
import { getIncidentCategoryLabel, getRiskLabel } from '@/utils';

const categories: IncidentCategory[] = [
  'digital_arrest',
  'upi_fraud',
  'investment_scam',
  'counterfeit_currency',
  'loan_app',
  'sim_swap',
  'other',
];

const riskLevels: RiskLevel[] = ['medium', 'high', 'critical'];

export default function ReportIncidentScreen() {
  const createCase = useCaseStore((state) => state.createCase);
  const isLoading = useCaseStore((state) => state.isLoading);
  const addLocalNotification = useNotificationStore((state) => state.addLocalNotification);
  const [category, setCategory] = useState<IncidentCategory>('digital_arrest');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('high');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recommendedTitle = useMemo(() => `${getIncidentCategoryLabel(category)} report`, [category]);

  const submitReport = async () => {
    if (title.trim().length < 3) {
      setError('Add a short report title.');
      return;
    }

    if (description.trim().length < 10) {
      setError('Add the key incident details.');
      return;
    }

    setError(null);
    const caseItem = await createCase({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim() || undefined,
      riskLevel,
    });
    addLocalNotification(`Report created: ${caseItem.title}`, riskLevel === 'critical' ? 'sos' : 'case');
    router.push({ pathname: '/(tabs)/case/[id]', params: { id: caseItem.id } });
  };

  return (
    <ScreenContainer scroll>
      <Typography variant="h1">Report Incident</Typography>
      <Text style={styles.subtitle}>Create a complaint record for review and evidence tracking.</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Incident Type</Text>
        <View style={styles.chipGrid}>
          {categories.map((item) => (
            <Pressable
              key={item}
              style={[styles.chip, category === item && styles.chipSelected]}
              onPress={() => {
                setCategory(item);
                if (!title.trim()) setTitle(`${getIncidentCategoryLabel(item)} report`);
              }}
            >
              <Text style={[styles.chipText, category === item && styles.chipTextSelected]}>
                {getIncidentCategoryLabel(item)}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card style={styles.section}>
        <Input
          label="Title"
          value={title}
          placeholder={recommendedTitle}
          onChangeText={setTitle}
          error={error?.includes('title') ? error : undefined}
        />
        <Input label="Location" value={location} placeholder="City, district, or branch" onChangeText={setLocation} />
        <Input
          label="Details"
          value={description}
          placeholder="Caller ID, account, URL, transaction, or sequence of events"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          onChangeText={setDescription}
          style={styles.detailsInput}
          error={error?.includes('details') ? error : undefined}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Risk</Text>
        <View style={styles.riskRow}>
          {riskLevels.map((item) => (
            <Pressable
              key={item}
              style={[styles.riskChip, riskLevel === item && styles.riskChipSelected]}
              onPress={() => setRiskLevel(item)}
            >
              <Text style={[styles.chipText, riskLevel === item && styles.chipTextSelected]}>{getRiskLabel(item)}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Submit report" iconName="send-check-outline" loading={isLoading} onPress={submitReport} />
      <Button title="Emergency SOS" iconName="alarm-light-outline" variant="danger" onPress={() => router.push('/(tabs)/sos')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  chipText: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: '800',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  detailsInput: {
    minHeight: 110,
  },
  error: {
    color: Colors.light.danger,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  riskChip: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  riskChipSelected: {
    backgroundColor: Colors.light.info,
    borderColor: Colors.light.info,
  },
  riskRow: {
    flexDirection: 'row',
    gap: 8,
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
  subtitle: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 14,
  },
});
