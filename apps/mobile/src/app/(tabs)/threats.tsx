import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { ThreatCard } from '@/components/threats/ThreatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IncidentCategory } from '@/types';
import { getIncidentCategoryLabel } from '@/utils';
import { router } from 'expo-router';
import { useThreatStore } from '@/store/threatStore';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { EmptyState } from '@/components/ui/EmptyState';

const filters: (IncidentCategory | 'all')[] = [
  'all',
  'digital_arrest',
  'upi_fraud',
  'investment_scam',
  'counterfeit_currency',
  'sim_swap',
];

export default function ThreatsScreen() {
  const { colors } = useAppTheme();
  const { threats, isLoading, error, source, lastSyncedAt, fetchThreats } = useThreatStore();
  const [selectedFilter, setSelectedFilter] = useState<IncidentCategory | 'all'>('all');
  useEffect(() => { fetchThreats(); }, [fetchThreats]);
  const filteredThreats = useMemo(
    () => threats.filter((threat) => selectedFilter === 'all' || threat.category === selectedFilter),
    [selectedFilter, threats]
  );
  const criticalCount = threats.filter((threat) => threat.level === 'critical' || threat.level === 'high').length;

  return (
    <ScreenContainer scroll refreshing={isLoading && threats.length > 0} onRefresh={() => fetchThreats(true)}>
      <View style={styles.header}>
        <Typography variant="h1">Threat Feed</Typography>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{criticalCount} priority advisories active</Text>
      </View>

      <SyncStatus error={error} cached={source === 'cached'} lastSyncedAt={lastSyncedAt} onRetry={() => fetchThreats(true)} />

      <Card tone="muted" style={styles.briefing}>
        <Text style={[styles.briefingTitle, { color: colors.text }]}>Citizen Watch</Text>
        <Text style={[styles.briefingText, { color: colors.muted }]}>
          Review active advisories before responding to unfamiliar calls, links, or payment requests.
        </Text>
        <Button
          title="Report matching incident"
          iconName="file-alert-outline"
          variant="secondary"
          onPress={() => router.push('/(tabs)/report')}
        />
      </Card>

      <View accessibilityRole="radiogroup" style={styles.filters}>
        {filters.map((filter) => {
          const selected = selectedFilter === filter;
          return (
            <Pressable
              key={filter}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              style={[styles.filterChip, { backgroundColor: selected ? colors.surfaceMuted : colors.surface, borderColor: selected ? colors.tint : colors.border }]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, { color: selected ? colors.tint : colors.text }]}>
                {filter === 'all' ? 'All' : getIncidentCategoryLabel(filter)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading && !threats.length ? <SkeletonList /> : filteredThreats.map((threat) => (
        <ThreatCard key={threat.id} threat={threat} />
      ))}
      {!isLoading && !filteredThreats.length && <EmptyState iconName="radar" title="No active advisories" message={error ? 'Threat intelligence could not be loaded. Pull down to retry.' : 'There are no advisories matching this filter.'} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  briefing: {
    marginBottom: 14,
  },
  briefingText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  briefingTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  header: {
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});
