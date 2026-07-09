import React from 'react';
import { SafeAreaView, StyleSheet, ViewProps, View } from 'react-native';

export const ScreenContainer = ({ children, style, ...props }: ViewProps) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
