import React from 'react';
import { View, Text } from 'react-native';

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}
