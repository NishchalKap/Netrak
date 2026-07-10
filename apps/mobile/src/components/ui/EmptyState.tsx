import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants';

export function EmptyState({
  iconName,
  title,
  message,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  message: string;
}) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={iconName} size={32} color={Colors.light.muted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 24,
  },
  message: {
    color: Colors.light.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: 'center',
  },
  title: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
});
