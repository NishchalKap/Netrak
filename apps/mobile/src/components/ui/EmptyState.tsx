import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '@/hooks/useAppTheme';
export function EmptyState({ iconName, title, message }: { iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name']; title: string; message: string; }) { const { colors } = useAppTheme(); return <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: colors.surfaceMuted }]}><MaterialCommunityIcons name={iconName} size={28} color={colors.tint} /></View><Text style={[styles.title, { color: colors.text }]}>{title}</Text><Text style={[styles.message, { color: colors.muted }]}>{message}</Text></View>; }
const styles = StyleSheet.create({ container: { alignItems: 'center', borderRadius: 20, borderWidth: 1, padding: 28 }, icon: { alignItems: 'center', borderRadius: 16, height: 52, justifyContent: 'center', width: 52 }, message: { fontSize: 14, lineHeight: 20, marginTop: 6, textAlign: 'center' }, title: { fontSize: 16, fontWeight: '700', marginTop: 14 } });
