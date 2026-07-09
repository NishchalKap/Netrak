import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login</Text>
      <Button title="Sign in" onPress={() => login()} />
    </View>
  );
}
