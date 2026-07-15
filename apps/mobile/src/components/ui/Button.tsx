import React, { memo, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator, GestureResponderEvent, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '@/hooks/useAppTheme';

interface ButtonProps extends TouchableOpacityProps { title: string; loading?: boolean; variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'; iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name']; }

export const Button = memo(function Button({ title, loading, variant = 'primary', iconName, style, onPress, disabled, accessibilityLabel, ...props }: ButtonProps) {
  const { colors } = useAppTheme();
  const palette = variant === 'primary'
    ? { backgroundColor: colors.text, borderColor: colors.text, color: colors.background }
    : variant === 'danger'
      ? { backgroundColor: colors.danger, borderColor: colors.danger, color: colors.onDanger }
      : variant === 'ghost'
        ? { backgroundColor: 'transparent', borderColor: 'transparent', color: colors.text }
        : { backgroundColor: variant === 'secondary' ? colors.surfaceMuted : colors.surface, borderColor: colors.border, color: colors.text };
  const handlePress = useCallback((event: GestureResponderEvent) => {
    if (Platform.OS !== 'web') void Haptics.selectionAsync().catch(() => undefined);
    onPress?.(event);
  }, [onPress]);
  return <TouchableOpacity {...props} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? title} accessibilityState={{ disabled: Boolean(loading || disabled), busy: Boolean(loading) }} style={[styles.base, palette, (loading || disabled) && styles.disabled, style]} disabled={loading || disabled} activeOpacity={0.82} onPress={handlePress}>
    {loading ? <ActivityIndicator color={palette.color} /> : <>{iconName && <MaterialCommunityIcons name={iconName} size={19} color={palette.color} style={styles.icon} />}<Text style={[styles.text, { color: palette.color }]}>{title}</Text></>}
  </TouchableOpacity>;
});
const styles = StyleSheet.create({ base: { alignItems: 'center', borderRadius: 14, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', marginVertical: 6, minHeight: 48, paddingHorizontal: 16, paddingVertical: 12 }, disabled: { opacity: 0.5 }, icon: { marginRight: 8 }, text: { fontSize: 15, fontWeight: '700' } });
