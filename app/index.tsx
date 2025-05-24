import { auth } from '@/app/config/firebase';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Wait for auth to initialize before redirecting
      setTimeout(() => {
        router.replace(user ? '/notes' : '/login');
      }, 100);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}