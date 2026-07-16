import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
interface InputProps extends TextInputProps { label?: string; error?: string; }
export const Input = ({ label, error, style, ...props }: InputProps) => {
  const { colors } = useAppTheme();
  return <View style={styles.container}>{label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}<TextInput style={[styles.input, { backgroundColor: colors.surfaceMuted, borderColor: error ? colors.danger : colors.border, color: colors.text }, style]} placeholderTextColor={colors.muted} accessibilityLabel={label} {...props} />{error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}</View>;
};
const styles = StyleSheet.create({ container: { marginVertical: 8 }, label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3, marginBottom: 8, textTransform: 'uppercase' }, input: { borderRadius: 14, borderWidth: 1, fontSize: 16, padding: 14 }, errorText: { fontSize: 12, marginTop: 5 } });
