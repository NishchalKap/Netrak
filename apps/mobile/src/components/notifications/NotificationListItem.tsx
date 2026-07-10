import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { Notification } from '@/types';
import { formatDateTime } from '@/utils';

export function NotificationListItem({
  item,
  onPress,
}: {
  item: Notification;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={[styles.card, !item.read && styles.unread]}>
        <View style={styles.row}>
          <View style={[styles.iconWrap, !item.read && styles.iconUnread]}>
            <MaterialCommunityIcons name={getIconName(item.category)} size={20} color={Colors.light.tint} />
          </View>
          <View style={styles.content}>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
          </View>
          {!item.read && <View style={styles.dot} />}
        </View>
      </Card>
    </Pressable>
  );
}

function getIconName(category: Notification['category']) {
  if (category === 'case') return 'folder-alert-outline';
  if (category === 'threat') return 'radar';
  if (category === 'sos') return 'alarm-light-outline';
  return 'bell-outline';
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  date: {
    color: Colors.light.muted,
    fontSize: 12,
    marginTop: 4,
  },
  dot: {
    backgroundColor: Colors.light.danger,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  iconUnread: {
    backgroundColor: '#dbeafe',
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  message: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.82,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  unread: {
    borderColor: '#bfdbfe',
  },
});
