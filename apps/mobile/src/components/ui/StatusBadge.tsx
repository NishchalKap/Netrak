import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/constants';
import { CaseStatus, RiskLevel, ThreatLevel } from '@/types';
import { getRiskLabel, getStatusLabel, getThreatLabel } from '@/utils';

type BadgeValue = CaseStatus | RiskLevel | ThreatLevel;

export function StatusBadge({ value }: { value: BadgeValue }) {
  const tone = getTone(value);
  const label = getLabel(value);

  return (
    <View style={[styles.badge, { backgroundColor: tone.background }]}>
      <Text style={[styles.text, { color: tone.color }]}>{label}</Text>
    </View>
  );
}

function getLabel(value: BadgeValue) {
  if (value === 'OPEN' || value === 'IN_PROGRESS' || value === 'ESCALATED' || value === 'CLOSED') {
    return getStatusLabel(value);
  }

  if (value === 'advisory' || value === 'elevated' || value === 'high' || value === 'critical') {
    return getThreatLabel(value);
  }

  return getRiskLabel(value);
}

function getTone(value: BadgeValue) {
  if (value === 'critical' || value === 'ESCALATED') return { background: '#fee2e2', color: Colors.light.danger };
  if (value === 'high' || value === 'IN_PROGRESS') return { background: '#fef3c7', color: Colors.light.warning };
  if (value === 'medium' || value === 'elevated' || value === 'OPEN') return { background: '#dbeafe', color: Colors.light.tint };
  if (value === 'CLOSED' || value === 'low' || value === 'advisory') {
    return { background: '#dcfce7', color: Colors.light.success };
  }

  return { background: '#e0f2fe', color: Colors.light.info };
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
