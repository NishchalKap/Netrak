import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Colors } from '@/constants';
import { Case } from '@/types';
import { formatDateTime, getIncidentCategoryLabel } from '@/utils';

export function CaseListItem({ item, onPress }: { item: Case; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta}>{getIncidentCategoryLabel(item.category)}</Text>
          </View>
          <StatusBadge value={item.status} />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <MaterialCommunityIcons name="map-marker-outline" size={15} color={Colors.light.muted} />
            <Text style={styles.footerText}>{item.location ?? 'Location pending'}</Text>
          </View>
          <Text style={styles.footerText}>{formatDateTime(item.updatedAt)}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  description: {
    color: Colors.light.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  footerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  footerText: {
    color: Colors.light.muted,
    fontSize: 12,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  meta: {
    color: Colors.light.info,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  title: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '800',
  },
  titleWrap: {
    flex: 1,
  },
});
