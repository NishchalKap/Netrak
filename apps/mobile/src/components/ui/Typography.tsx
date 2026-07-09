import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'body' | 'caption';
}

export const Typography = ({ variant = 'body', style, ...props }: TypographyProps) => {
  return <Text style={[styles[variant], style]} {...props} />;
};

const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  h2: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
  body: { fontSize: 16, color: '#333' },
  caption: { fontSize: 12, color: '#666' },
});
