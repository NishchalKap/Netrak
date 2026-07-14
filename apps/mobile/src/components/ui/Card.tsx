import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface CardProps extends ViewProps {
  tone?: 'default' | 'muted' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export function Card({ tone = 'default', style, children, ...props }: CardProps) {
  const { colors } = useAppTheme();
  const toneStyle = tone === 'muted'
    ? { backgroundColor: colors.surfaceMuted }
    : tone === 'danger'
      ? { backgroundColor: `${colors.danger}14`, borderColor: `${colors.danger}55` }
      : undefined;
  return <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, toneStyle, style]} {...props}>{children}</View>;
}

const styles = StyleSheet.create({ card: { borderRadius: 20, borderWidth: 1, padding: 18 } });
