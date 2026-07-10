import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors } from '@/constants';
import { ThreatItem } from '@/types';
import { formatDateTime, getIncidentCategoryLabel } from '@/utils';

export function ThreatCard({ threat }: { threat: ThreatItem }) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{threat.title}</Text>
          <Text style={styles.category}>{getIncidentCategoryLabel(threat.category)}</Text>
        </View>
        <StatusBadge value={threat.level} />
      </View>

      <Text style={styles.summary}>{threat.summary}</Text>

      <View style={styles.region}>
        <MaterialCommunityIcons name="map-marker-radius-outline" size={16} color={Colors.light.info} />
        <Text style={styles.regionText}>{threat.region}</Text>
      </View>

      <View style={styles.indicators}>
        {threat.indicators.map((indicator) => (
          <View key={indicator} style={styles.indicator}>
            <Text style={styles.indicatorText}>{indicator}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.updated}>{formatDateTime(threat.updatedAt)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  category: {
    color: Colors.light.info,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  indicator: {
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  indicatorText: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: '600',
  },
  indicators: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  region: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  regionText: {
    color: Colors.light.info,
    fontSize: 13,
    fontWeight: '700',
  },
  summary: {
    color: Colors.light.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  title: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '800',
  },
  titleWrap: {
    flex: 1,
  },
  updated: {
    color: Colors.light.muted,
    fontSize: 12,
    marginTop: 12,
  },
});
