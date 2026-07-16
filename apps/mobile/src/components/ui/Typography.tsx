import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
interface TypographyProps extends TextProps { variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption'; }
export const Typography = ({ variant = 'body', style, ...props }: TypographyProps) => {
  const { colors } = useAppTheme();
  return <Text style={[styles[variant], { color: variant === 'caption' ? colors.muted : colors.text }, style]} {...props} />;
};
const styles = StyleSheet.create({ h1: { fontSize: 34, fontWeight: '800', letterSpacing: -1.1, lineHeight: 40, marginBottom: 10 }, h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.45, marginBottom: 10 }, h3: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2, marginBottom: 8 }, body: { fontSize: 16, lineHeight: 22 }, caption: { fontSize: 12, lineHeight: 17 } });
