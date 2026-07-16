import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { CaseListItem } from '@/components/cases/CaseListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useCaseStore } from '@/store/caseStore';
import { Case, CaseStatus } from '@/types';
import { getStatusLabel } from '@/utils';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { SkeletonList } from '@/components/ui/SkeletonList';

const filters: (CaseStatus | 'ALL')[] = ['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED'];

export default function ReportHistoryScreen() {
  const { colors } = useAppTheme();
  const cases = useCaseStore((state) => state.cases);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const isLoading = useCaseStore((state) => state.isLoading);
  const error = useCaseStore((state) => state.error);
  const source = useCaseStore((state) => state.source);
  const lastSyncedAt = useCaseStore((state) => state.lastSyncedAt);
  const [filter, setFilter] = useState<CaseStatus | 'ALL'>('ALL');

  useEffect(() => { void fetchCases(); }, [fetchCases]);

  const filteredCases = useMemo(
    () => cases.filter((caseItem) => filter === 'ALL' || caseItem.status === filter),
    [cases, filter]
  );
  const openCase = useCallback((item: Case) => {
    router.push({ pathname: '/(tabs)/case/[id]', params: { id: item.id } });
  }, []);
  const renderCase = useCallback(({ item }: { item: Case }) => <CaseListItem item={item} onPress={() => openCase(item)} />, [openCase]);

  const header = <>
    <View style={styles.header}>
      <View>
        <Typography variant="h1">Report History</Typography>
        <Text style={[styles.subtitle, { color: colors.muted }]}>{cases.length} total reports</Text>
      </View>
      <Button title="New" iconName="plus" onPress={() => router.push('/(tabs)/report')} />
    </View>
    <SyncStatus error={error} cached={source === 'cached'} lastSyncedAt={lastSyncedAt} onRetry={() => { void fetchCases(true); }} />
    <View accessibilityRole="radiogroup" style={styles.filters}>
      {filters.map((item) => {
        const selected = filter === item;
        return <Pressable key={item} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.filter, { backgroundColor: selected ? colors.surfaceMuted : colors.surface, borderColor: selected ? colors.tint : colors.border }]} onPress={() => setFilter(item)}>
          <Text style={[styles.filterText, { color: selected ? colors.tint : colors.text }]}>{item === 'ALL' ? 'All' : getStatusLabel(item)}</Text>
        </Pressable>;
      })}
    </View>
  </>;

  return <ScreenContainer>
    <FlatList
      data={filteredCases}
      renderItem={renderCase}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      ListEmptyComponent={isLoading && !cases.length ? <SkeletonList /> : <EmptyState iconName={isLoading ? 'sync' : 'clipboard-text-off-outline'} title={error ? 'Reports unavailable' : 'No reports found'} message={error ? 'Pull down to retry when your connection is available.' : 'Reports matching this status will appear here.'} />}
      refreshing={isLoading && cases.length > 0}
      onRefresh={() => { void fetchCases(true); }}
      initialNumToRender={6}
      maxToRenderPerBatch={8}
      windowSize={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  filter: { borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  filterText: { fontSize: 12, fontWeight: '800' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  header: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  list: { paddingBottom: 16 },
  subtitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
});
