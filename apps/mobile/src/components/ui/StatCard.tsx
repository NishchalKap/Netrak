import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: toneBackground[tone] }]}>
        {iconName && <MaterialCommunityIcons name={iconName} size={20} color={toneColor[tone]} />}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const toneColor = {
  info: Colors.light.info,
  success: Colors.light.success,
  warning: Colors.light.warning,
  danger: Colors.light.danger,
  violet: Colors.light.violet,
};

const toneBackground = {
  info: '#ccfbf1',
  success: '#dcfce7',
  warning: '#fef3c7',
  danger: '#fee2e2',
  violet: '#ede9fe',
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
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
    color: Colors.light.muted,
    fontSize: 12,
    marginTop: 4,
  },
  value: {
    color: Colors.light.text,
    fontSize: 24,
    fontWeight: '800',
  },
});
