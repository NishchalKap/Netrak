import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useCaseStore } from '@/store/caseStore';
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
  const { colors } = useAppTheme();
  const createCase = useCaseStore((state) => state.createCase);
  const isLoading = useCaseStore((state) => state.isMutating);
  const apiError = useCaseStore((state) => state.mutationError);
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
    if (!caseItem) return;
    router.push({ pathname: '/(tabs)/case/[id]', params: { id: caseItem.id } });
  };

  return (
    <ScreenContainer scroll>
      <Typography variant="h1">Report Incident</Typography>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Create a complaint record for review and evidence tracking.</Text>

      <Card style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Incident Type</Text>
        <View accessibilityRole="radiogroup" style={styles.chipGrid}>
          {categories.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ checked: category === item }}
              style={[styles.chip, { backgroundColor: category === item ? colors.surfaceMuted : colors.surface, borderColor: category === item ? colors.tint : colors.border }]}
              onPress={() => {
                setCategory(item);
                if (!title.trim()) setTitle(`${getIncidentCategoryLabel(item)} report`);
              }}
            >
              <Text style={[styles.chipText, { color: category === item ? colors.tint : colors.text }]}>
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk</Text>
        <View accessibilityRole="radiogroup" style={styles.riskRow}>
          {riskLevels.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ checked: riskLevel === item }}
              style={[styles.riskChip, { backgroundColor: riskLevel === item ? colors.surfaceMuted : colors.surface, borderColor: riskLevel === item ? colors.tint : colors.border }]}
              onPress={() => setRiskLevel(item)}
            >
              <Text style={[styles.chipText, { color: riskLevel === item ? colors.tint : colors.text }]}>{getRiskLabel(item)}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      {(error || apiError) && <Text accessibilityRole="alert" style={[styles.error, { color: colors.danger }]}>{error || apiError}</Text>}
      <Button title="Submit report" iconName="send-check-outline" loading={isLoading} onPress={submitReport} />
      <Button title="Emergency SOS" iconName="alarm-light-outline" variant="danger" onPress={() => router.push('/(tabs)/sos')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  chip: {
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
  chipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  detailsInput: {
    minHeight: 110,
  },
  error: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  riskChip: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  riskRow: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 14,
  },
});
