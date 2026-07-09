import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';

export default function RoleSelectionScreen() {
  return (
    <ScreenContainer>
      <Typography variant="h1">Select Role</Typography>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Button title="Citizen" onPress={() => router.push('/(auth)/register')} />
        <Button title="Police Officer" onPress={() => router.push('/(auth)/register')} />
        <Button title="Bank Official" onPress={() => router.push('/(auth)/register')} />
        <Button title="Telecom Official" onPress={() => router.push('/(auth)/register')} />
      </View>
    </ScreenContainer>
  );
}
