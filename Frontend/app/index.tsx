import { registerRootComponent } from 'expo';
import RootLayout from './_layout';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Register the root component of your app
registerRootComponent(() => <RootLayout />);