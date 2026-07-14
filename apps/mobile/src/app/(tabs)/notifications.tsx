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
import { useAppTheme } from '@/hooks/useAppTheme';
import { SyncStatus } from '@/components/ui/SyncStatus';
import { SkeletonList } from '@/components/ui/SkeletonList';

export default function NotificationCenterScreen() {
  const { colors } = useAppTheme();
  const { notifications, fetchNotifications, markRead, markAllRead, isLoading, error, source, lastSyncedAt } = useNotificationStore();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <ScreenContainer scroll refreshing={isLoading && notifications.length > 0} onRefresh={() => fetchNotifications(true)}>
      <Pressable accessibilityRole="button" accessibilityLabel="Go back" style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
      </Pressable>

      <View style={styles.header}>
        <View>
          <Typography variant="h1">Notifications</Typography>
          <Text style={[styles.subtitle, { color: colors.muted }]}>{unreadCount} unread alerts</Text>
        </View>
        <Button title="Read all" iconName="check-all" variant="outline" disabled={unreadCount === 0} onPress={markAllRead} />
      </View>

      <SyncStatus error={error} cached={source === 'cached'} lastSyncedAt={lastSyncedAt} onRetry={() => fetchNotifications(true)} />

      {isLoading && !notifications.length ? <SkeletonList /> : notifications.length ? (
        notifications.map((notification) => (
          <NotificationListItem key={notification.id} item={notification} onPress={() => markRead(notification.id)} />
        ))
      ) : (
        <EmptyState iconName="bell-off-outline" title={error ? 'Notifications unavailable' : 'No notifications'} message={error ? 'Pull down to retry when your connection is available.' : 'Case and threat alerts will appear here.'} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
});
