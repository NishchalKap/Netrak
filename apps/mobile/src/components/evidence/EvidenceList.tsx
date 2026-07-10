import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors } from '@/constants';
import { Evidence, EvidenceType } from '@/types';
import { formatDateTime } from '@/utils';

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (!evidence.length) {
    return (
      <EmptyState
        iconName="file-upload-outline"
        title="No evidence attached"
        message="Audio, screenshots, chat exports, and document references will appear here."
      />
    );
  }

  return (
    <View style={styles.list}>
      {evidence.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={getEvidenceIcon(item.type)} size={20} color={Colors.light.info} />
          </View>
          <View style={styles.content}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.reference} numberOfLines={1}>
              {item.reference}
            </Text>
            <Text style={styles.date}>{formatDateTime(item.createdAt)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function getEvidenceIcon(type: EvidenceType) {
  if (type === 'audio') return 'microphone-outline';
  if (type === 'image') return 'image-outline';
  if (type === 'video') return 'video-outline';
  if (type === 'document') return 'file-document-outline';
  if (type === 'chat') return 'message-text-outline';
  if (type === 'link') return 'link-variant';
  return 'note-text-outline';
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  date: {
    color: Colors.light.muted,
    fontSize: 12,
    marginTop: 2,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#ccfbf1',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  label: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  reference: {
    color: Colors.light.muted,
    fontSize: 13,
    marginTop: 2,
  },
  row: {
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
});
