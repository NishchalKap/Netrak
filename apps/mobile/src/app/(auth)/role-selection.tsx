import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants';
import { UserRole } from '@/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const roles: { label: string; role: UserRole; icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[] = [
  { label: 'Citizen', role: 'CITIZEN', icon: 'account-heart-outline' },
  { label: 'Police Officer', role: 'OFFICER', icon: 'shield-account-outline' },
  { label: 'Admin', role: 'ADMIN', icon: 'account-cog-outline' },
];

export default function RoleSelectionScreen() {
  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <Typography variant="h1">Select Role</Typography>
      <Typography variant="body" style={styles.subtitle}>
        Choose the account boundary.
      </Typography>
      <View style={styles.list}>
        {roles.map((item) => (
          <Card key={item.role}>
            <Button
              title={item.label}
              iconName={item.icon}
              variant={item.role === 'CITIZEN' ? 'primary' : 'outline'}
              onPress={() => router.push({ pathname: '/(auth)/register', params: { role: item.role } })}
            />
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 18,
  },
  scroll: {
    justifyContent: 'center',
  },
  subtitle: {
    color: Colors.light.muted,
  },
});
