import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { ThreatCard } from '@/components/threats/ThreatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/useAppTheme';
import { IncidentCategory, ThreatItem } from '@/types';
import { getIncidentCategoryLabel } from '@/utils';
import { useThreatStore } from '@/store/threatStore';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { SkeletonList } from '@/components/ui/SkeletonList';
import { EmptyState } from '@/components/ui/EmptyState';

const filters: (IncidentCategory | 'all')[] = ['all', 'digital_arrest', 'upi_fraud', 'investment_scam', 'counterfeit_currency', 'sim_swap'];

export default function ThreatsScreen() {
  const { colors } = useAppTheme();
  const threats = useThreatStore((state) => state.threats);
  const isLoading = useThreatStore((state) => state.isLoading);
  const error = useThreatStore((state) => state.error);
  const source = useThreatStore((state) => state.source);
  const lastSyncedAt = useThreatStore((state) => state.lastSyncedAt);
  const fetchThreats = useThreatStore((state) => state.fetchThreats);
  const [selectedFilter, setSelectedFilter] = useState<IncidentCategory | 'all'>('all');

  useEffect(() => { void fetchThreats(); }, [fetchThreats]);
  const filteredThreats = useMemo(() => threats.filter((threat) => selectedFilter === 'all' || threat.category === selectedFilter), [selectedFilter, threats]);
  const criticalCount = useMemo(() => threats.filter((threat) => threat.level === 'critical' || threat.level === 'high').length, [threats]);
  const renderThreat = useCallback(({ item }: { item: ThreatItem }) => <ThreatCard threat={item} />, []);

  const header = <>
    <View style={styles.header}>
      <Typography variant="h1">Threat Feed</Typography>
      <Text style={[styles.subtitle, { color: colors.muted }]}>{criticalCount} priority advisories in this feed</Text>
    </View>
    <SyncStatus error={error} cached={source === 'cached'} lastSyncedAt={lastSyncedAt} onRetry={() => { void fetchThreats(true); }} />
    <Card tone="muted" style={styles.briefing}>
      <Text style={[styles.briefingTitle, { color: colors.text }]}>Citizen Watch</Text>
      <Text style={[styles.briefingText, { color: colors.muted }]}>Review configured advisories before responding to unfamiliar calls, links, or payment requests.</Text>
      <Button title="Report matching incident" iconName="file-alert-outline" variant="secondary" onPress={() => router.push('/(tabs)/report')} />
    </Card>
    <View accessibilityRole="radiogroup" style={styles.filters}>
      {filters.map((filter) => {
        const selected = selectedFilter === filter;
        return <Pressable key={filter} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.filterChip, { backgroundColor: selected ? colors.surfaceMuted : colors.surface, borderColor: selected ? colors.tint : colors.border }]} onPress={() => setSelectedFilter(filter)}>
          <Text style={[styles.filterText, { color: selected ? colors.tint : colors.text }]}>{filter === 'all' ? 'All' : getIncidentCategoryLabel(filter)}</Text>
        </Pressable>;
      })}
    </View>
  </>;

  return <ScreenContainer>
    <FlatList
      data={filteredThreats}
      renderItem={renderThreat}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      ListEmptyComponent={isLoading && !threats.length ? <SkeletonList /> : <EmptyState iconName="radar" title="No configured advisories" message={error ? 'Threat advisories could not be loaded. Pull down to retry.' : 'There are no advisories matching this filter.'} />}
      refreshing={isLoading && threats.length > 0}
      onRefresh={() => { void fetchThreats(true); }}
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      windowSize={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  briefing: { marginBottom: 14 },
  briefingText: { fontSize: 14, lineHeight: 20, marginTop: 4 },
  briefingTitle: { fontSize: 17, fontWeight: '800' },
  filterChip: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 12, fontWeight: '800' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  header: { marginBottom: 4 },
  list: { paddingBottom: 16 },
  subtitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
});
