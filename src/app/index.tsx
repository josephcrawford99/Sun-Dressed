import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Start with auth screen
    router.replace('/(auth)');
  }, []);

  return null;
}