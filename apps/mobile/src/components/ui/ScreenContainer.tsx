import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View, ScrollView, StyleProp, ViewStyle, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
interface ScreenContainerProps extends ViewProps { scroll?: boolean; contentContainerStyle?: StyleProp<ViewStyle>; refreshing?: boolean; onRefresh?: () => void; }
export const ScreenContainer = ({ children, style, scroll, contentContainerStyle, refreshing = false, onRefresh, ...props }: ScreenContainerProps) => {
  const { colors } = useAppTheme();
  const content = <View style={[styles.container, !scroll && contentContainerStyle, style]} {...props}>{children}</View>;
  return <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>{scroll ? <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} colors={[colors.tint]} /> : undefined} contentContainerStyle={[styles.scrollContent, contentContainerStyle]}>{content}</ScrollView> : content}</KeyboardAvoidingView></SafeAreaView>;
};
const styles = StyleSheet.create({ safe: { flex: 1 }, container: { alignSelf: 'center', flex: 1, maxWidth: 760, paddingBottom: 36, paddingHorizontal: 20, paddingTop: 20, width: '100%' }, scrollContent: { flexGrow: 1 } });
