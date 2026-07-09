import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="threats" />
      <Tabs.Screen name="network" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
