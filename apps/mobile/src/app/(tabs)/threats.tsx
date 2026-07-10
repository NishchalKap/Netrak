import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { ThreatCard } from '@/components/threats/ThreatCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { threatFeed } from '@/data/threatFeed';
import { Colors } from '@/constants';
import { IncidentCategory } from '@/types';
import { getIncidentCategoryLabel } from '@/utils';
import { router } from 'expo-router';

const filters: (IncidentCategory | 'all')[] = [
  'all',
  'digital_arrest',
  'upi_fraud',
  'investment_scam',
  'counterfeit_currency',
  'sim_swap',
];

export default function ThreatsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<IncidentCategory | 'all'>('all');
  const filteredThreats = useMemo(
    () => threatFeed.filter((threat) => selectedFilter === 'all' || threat.category === selectedFilter),
    [selectedFilter]
  );
  const criticalCount = threatFeed.filter((threat) => threat.level === 'critical' || threat.level === 'high').length;

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Typography variant="h1">Threat Feed</Typography>
        <Text style={styles.subtitle}>{criticalCount} priority advisories active</Text>
      </View>

      <Card tone="muted" style={styles.briefing}>
        <Text style={styles.briefingTitle}>Citizen Watch</Text>
        <Text style={styles.briefingText}>
          Digital arrest and QR fraud remain the highest-risk signals in the current feed.
        </Text>
        <Button
          title="Report matching incident"
          iconName="file-alert-outline"
          variant="secondary"
          onPress={() => router.push('/(tabs)/report')}
        />
      </Card>

      <View style={styles.filters}>
        {filters.map((filter) => {
          const selected = selectedFilter === filter;
          return (
            <Pressable
              key={filter}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                {filter === 'all' ? 'All' : getIncidentCategoryLabel(filter)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filteredThreats.map((threat) => (
        <ThreatCard key={threat.id} threat={threat} />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  briefing: {
    marginBottom: 14,
  },
  briefingText: {
    color: Colors.light.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  briefingTitle: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: '800',
  },
  filterChip: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipSelected: {
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
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});
