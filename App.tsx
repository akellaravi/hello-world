import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '@/screens/HomeScreen';
import theme from '@/theme/theme';

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <HomeScreen />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
