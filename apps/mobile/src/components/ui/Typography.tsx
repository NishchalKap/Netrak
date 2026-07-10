import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
}

export const Typography = ({ variant = 'body', style, ...props }: TypographyProps) => {
  return <Text style={[styles[variant], style]} {...props} />;
};

const styles = StyleSheet.create({
  h1: { color: Colors.light.text, fontSize: 30, fontWeight: '800', marginBottom: 12 },
  h2: { color: Colors.light.text, fontSize: 23, fontWeight: '700', marginBottom: 10 },
  h3: { color: Colors.light.text, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  body: { color: Colors.light.text, fontSize: 16, lineHeight: 22 },
  caption: { color: Colors.light.muted, fontSize: 12, lineHeight: 17 },
});
