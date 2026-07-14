import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '@/hooks/useAppTheme';

export function StatCard({
  label,
  value,
  iconName,
  tone = 'info',
}: {
  label: string;
  value: string;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'violet';
}) {
  const { colors } = useAppTheme();
  const toneColor = { info: colors.info, success: colors.success, warning: colors.warning, danger: colors.danger, violet: colors.violet };
  const iconColor = toneColor[tone];
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: `${iconColor}18` }]}>
        {iconName && <MaterialCommunityIcons name={iconName} size={20} color={iconColor} />}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 118,
    padding: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    marginBottom: 12,
    width: 34,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
});
