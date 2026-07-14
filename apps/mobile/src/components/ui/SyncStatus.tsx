import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '@/hooks/useAppTheme';
import { formatDateTime } from '@/utils';

export function SyncStatus({ error, cached, lastSyncedAt, onRetry }: { error: string | null; cached?: boolean; lastSyncedAt?: string | null; onRetry: () => void }) {
  const { colors } = useAppTheme();
  if (!error && !cached) return null;
  const title = cached ? 'Cached intelligence' : 'Unable to refresh';
  const detail = cached && lastSyncedAt ? `Last synced ${formatDateTime(lastSyncedAt)}` : error ?? 'Data may be out of date.';
  return <View accessibilityRole="alert" style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}><MaterialCommunityIcons name={cached ? 'cloud-off-outline' : 'alert-circle-outline'} size={18} color={colors.warning} /><View style={styles.copy}><Text style={[styles.title, { color: colors.text }]}>{title}</Text><Text style={[styles.detail, { color: colors.muted }]}>{detail}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Retry sync" onPress={onRetry}><Text style={[styles.retry, { color: colors.tint }]}>Retry</Text></Pressable></View>;
}

const styles = StyleSheet.create({ container: { alignItems: 'center', borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 10, marginBottom: 14, padding: 12 }, copy: { flex: 1 }, detail: { fontSize: 11, marginTop: 2 }, retry: { fontSize: 12, fontWeight: '700' }, title: { fontSize: 13, fontWeight: '700' } });
