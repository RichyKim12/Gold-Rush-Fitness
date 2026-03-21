// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

// ── Global default font — applies to every <Text> in the app ──
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: 'PressStart2P_400Regular' };

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = { fontFamily: 'PressStart2P_400Regular' };

function RootLayoutInner() {
  const { activeTheme } = useTheme();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  console.log('fonts loaded:', fontsLoaded, PressStart2P_400Regular); // ← add this
  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutInner />
    </ThemeProvider>
  );
}