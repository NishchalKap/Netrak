import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) { const { colors } = useAppTheme(); return <View style={styles.container}><Text style={[styles.title, { color: colors.text }]}>{title}</Text>{action}</View>; }
const styles = StyleSheet.create({ container: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 28 }, title: { fontSize: 19, fontWeight: '700', letterSpacing: -0.3 } });
