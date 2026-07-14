import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CaseStatus, RiskLevel, ThreatLevel } from '@/types';
import { getRiskLabel, getStatusLabel, getThreatLabel } from '@/utils';
import { useAppTheme } from '@/hooks/useAppTheme';
type BadgeValue = CaseStatus | RiskLevel | ThreatLevel;
export function StatusBadge({ value }: { value: BadgeValue }) {
  const { colors } = useAppTheme(); const tone = getTone(value, colors); const label = getLabel(value);
  return <View style={[styles.badge, { backgroundColor: tone.background }]}><Text style={[styles.text, { color: tone.color }]}>{label}</Text></View>;
}
function getLabel(value: BadgeValue) { if (value === 'OPEN' || value === 'IN_PROGRESS' || value === 'ESCALATED' || value === 'CLOSED') return getStatusLabel(value); if (value === 'advisory' || value === 'elevated' || value === 'high' || value === 'critical') return getThreatLabel(value); return getRiskLabel(value); }
function getTone(value: BadgeValue, colors: ReturnType<typeof useAppTheme>['colors']) { if (value === 'critical' || value === 'ESCALATED') return { background: `${colors.danger}22`, color: colors.danger }; if (value === 'high' || value === 'IN_PROGRESS') return { background: `${colors.warning}22`, color: colors.warning }; if (value === 'medium' || value === 'elevated' || value === 'OPEN') return { background: `${colors.tint}20`, color: colors.tint }; if (value === 'CLOSED' || value === 'low' || value === 'advisory') return { background: `${colors.success}22`, color: colors.success }; return { background: `${colors.tint}20`, color: colors.tint }; }
const styles = StyleSheet.create({ badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }, text: { fontSize: 11, fontWeight: '700' } });
