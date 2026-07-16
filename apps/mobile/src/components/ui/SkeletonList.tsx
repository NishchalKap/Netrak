import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export function SkeletonList({ count = 3 }: { count?: number }) {
  const { colors } = useAppTheme();
  return <View style={styles.list}>{Array.from({ length: count }, (_, index) => <View key={index} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={[styles.short, { backgroundColor: colors.surfaceMuted }]} /><View style={[styles.title, { backgroundColor: colors.surfaceMuted }]} /><View style={[styles.line, { backgroundColor: colors.surfaceMuted }]} /><View style={[styles.lineSmall, { backgroundColor: colors.surfaceMuted }]} /></View>)}</View>;
}

const styles = StyleSheet.create({ card: { borderRadius: 20, borderWidth: 1, padding: 18 }, line: { borderRadius: 6, height: 11, marginTop: 16, width: '100%' }, lineSmall: { borderRadius: 6, height: 11, marginTop: 8, width: '70%' }, list: { gap: 12 }, short: { borderRadius: 6, height: 9, width: 72 }, title: { borderRadius: 6, height: 18, marginTop: 12, width: '62%' } });
