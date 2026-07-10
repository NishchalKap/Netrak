import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants';

interface CardProps extends ViewProps {
  tone?: 'default' | 'muted' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export function Card({ tone = 'default', style, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, tone === 'muted' && styles.muted, tone === 'danger' && styles.danger, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  muted: {
    backgroundColor: Colors.light.surfaceMuted,
  },
  danger: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
});
