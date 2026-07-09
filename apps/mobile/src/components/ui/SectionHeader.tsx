import React from 'react';
import { View, Text } from 'react-native';

export function SectionHeader({ title }: { title: string }) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
