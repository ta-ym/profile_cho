import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Amplify } from 'aws-amplify';
import { DataStore } from 'aws-amplify/datastore';
import awsconfig from '@/aws-exports';

// Amplify 設定
Amplify.configure(awsconfig);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // DataStore 初期化（App起動時）
    const initDataStore = async () => {
      try {
        await DataStore.start();
        console.log('✅ DataStore 初期化完了 - オフライン同期開始');
      } catch (error) {
        console.error('❌ DataStore 初期化失敗:', error);
      }
    };

    initDataStore();

    return () => {
      DataStore.stop();
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
