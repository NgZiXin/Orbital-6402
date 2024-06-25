import { useFonts } from 'expo-font';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as React from 'react';

// This is basically the app.js file! 
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'inter-bold': require('../assets/fonts/Inter-Bold.ttf'),
    'inter-semibold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'inter-regular': require('../assets/fonts/Inter-Regular.ttf')
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false}} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false}} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
