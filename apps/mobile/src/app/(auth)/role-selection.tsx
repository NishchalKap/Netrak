import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAppTheme } from '@/hooks/useAppTheme';
import { UserRole } from '@/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const roles: {
  label: string;
  role: UserRole;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  selfService: boolean;
}[] = [
  { label: 'Create citizen account', role: 'CITIZEN', icon: 'account-heart-outline', selfService: true },
  { label: 'Officer sign in', role: 'OFFICER', icon: 'shield-account-outline', selfService: false },
  { label: 'Administrator sign in', role: 'ADMIN', icon: 'account-cog-outline', selfService: false },
];

export default function RoleSelectionScreen() {
  const { colors } = useAppTheme();
  return (
    <ScreenContainer scroll contentContainerStyle={styles.scroll}>
      <Typography variant="h1">Select Role</Typography>
      <Typography variant="body" style={[styles.subtitle, { color: colors.muted }]}>
        Citizen accounts can be created here. Organization accounts are issued by an authorized administrator.
      </Typography>
      <View style={styles.list}>
        {roles.map((item) => (
          <Card key={item.role}>
            <Button
              title={item.label}
              iconName={item.icon}
              variant={item.role === 'CITIZEN' ? 'primary' : 'outline'}
              onPress={() =>
                item.selfService
                  ? router.push({ pathname: '/(auth)/register', params: { role: item.role } })
                  : router.push('/(auth)/login')
              }
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
  subtitle: {},
});
