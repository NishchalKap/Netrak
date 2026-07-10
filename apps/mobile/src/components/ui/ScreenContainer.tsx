import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View, ScrollView, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '@/constants';

interface ScreenContainerProps extends ViewProps {
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer = ({ children, style, scroll, contentContainerStyle, ...props }: ScreenContainerProps) => {
  const content = (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
