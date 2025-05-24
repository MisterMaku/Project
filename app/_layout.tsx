import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ headerShown: true, title: 'StudyNote' }} />
      <Stack.Screen name="register" options={{ headerShown: true, title: 'StudyNote' }} />
      <Stack.Screen name="notes" options={{ headerShown: true, title: 'StudyNote' }} />
    </Stack>
  );
}
