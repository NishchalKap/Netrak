import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
import { Notification } from '@/types';

export default function NotificationCenterScreen() {
  const { colors } = useAppTheme();
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const source = useNotificationStore((state) => state.source);
  const lastSyncedAt = useNotificationStore((state) => state.lastSyncedAt);
  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  useEffect(() => { void fetchNotifications(); }, [fetchNotifications]);
  const renderNotification = useCallback(({ item }: { item: Notification }) => <NotificationListItem item={item} onPress={() => markRead(item.id)} />, [markRead]);

  const header = <>
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
    <SyncStatus error={error} cached={source === 'cached'} lastSyncedAt={lastSyncedAt} onRetry={() => { void fetchNotifications(true); }} />
  </>;

  return <ScreenContainer>
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      ListEmptyComponent={isLoading ? <SkeletonList /> : <EmptyState iconName="bell-off-outline" title={error ? 'Notifications unavailable' : 'No notifications'} message={error ? 'Pull down to retry when your connection is available.' : 'Case and threat alerts will appear here.'} />}
      refreshing={isLoading && notifications.length > 0}
      onRefresh={() => { void fetchNotifications(true); }}
      initialNumToRender={8}
      maxToRenderPerBatch={10}
      windowSize={7}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
    />
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  backButton: { alignItems: 'center', borderRadius: 8, borderWidth: 1, height: 42, justifyContent: 'center', marginBottom: 12, width: 42 },
  header: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  list: { paddingBottom: 16 },
  subtitle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
});
