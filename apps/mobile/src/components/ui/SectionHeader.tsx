import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  title: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '700',
  },
});
