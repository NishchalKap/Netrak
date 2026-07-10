import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationListItem } from '@/components/notifications/NotificationListItem';
import { useNotificationStore } from '@/store/notificationStore';
import { Colors } from '@/constants';

export default function NotificationCenterScreen() {
  const { notifications, fetchNotifications, markRead, markAllRead } = useNotificationStore();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <ScreenContainer scroll>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={Colors.light.text} />
      </Pressable>

      <View style={styles.header}>
        <View>
          <Typography variant="h1">Notifications</Typography>
          <Text style={styles.subtitle}>{unreadCount} unread alerts</Text>
        </View>
        <Button title="Read all" iconName="check-all" variant="outline" onPress={markAllRead} />
      </View>

      {notifications.length ? (
        notifications.map((notification) => (
          <NotificationListItem key={notification.id} item={notification} onPress={() => markRead(notification.id)} />
        ))
      ) : (
        <EmptyState iconName="bell-off-outline" title="No notifications" message="Case and threat alerts will appear here." />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginBottom: 12,
    width: 42,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitle: {
    color: Colors.light.muted,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});
