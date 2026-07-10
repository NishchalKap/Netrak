import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { CaseListItem } from '@/components/cases/CaseListItem';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants';
import { useCaseStore } from '@/store/caseStore';
import { CaseStatus } from '@/types';
import { getStatusLabel } from '@/utils';

const filters: (CaseStatus | 'ALL')[] = ['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'CLOSED'];

export default function ReportHistoryScreen() {
  const { cases, fetchCases, isLoading } = useCaseStore();
  const [filter, setFilter] = useState<CaseStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = useMemo(
    () => cases.filter((caseItem) => filter === 'ALL' || caseItem.status === filter),
    [cases, filter]
  );

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <View>
          <Typography variant="h1">Report History</Typography>
          <Text style={styles.subtitle}>{cases.length} total reports</Text>
        </View>
        <Button title="New" iconName="plus" onPress={() => router.push('/(tabs)/report')} />
      </View>

      <View style={styles.filters}>
        {filters.map((item) => {
          const selected = filter === item;
          return (
            <Pressable key={item} style={[styles.filter, selected && styles.filterSelected]} onPress={() => setFilter(item)}>
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                {item === 'ALL' ? 'All' : getStatusLabel(item)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredCases.length ? (
        filteredCases.map((caseItem) => (
          <CaseListItem
            key={caseItem.id}
            item={caseItem}
            onPress={() => router.push({ pathname: '/(tabs)/case/[id]', params: { id: caseItem.id } })}
          />
        ))
      ) : (
        <EmptyState
          iconName={isLoading ? 'sync' : 'clipboard-text-off-outline'}
          title={isLoading ? 'Loading reports' : 'No reports found'}
          message="Reports matching this status will appear here."
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filter: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  filterText: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: '800',
  },
  filterTextSelected: {
    color: '#ffffff',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});
