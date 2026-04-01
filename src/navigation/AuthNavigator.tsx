import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';

// プレースホルダースクリーン（実装はフェーズ3で行う）
const PlaceholderScreen: React.FC<{ name: string }> = ({ name }) => {
  const { View, Text } = require('react-native');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
      <Text style={{ marginTop: 10, color: '#999' }}>Coming in Phase 3</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * 認証フローナビゲーター
 * パスワード設定 → ログイン → プロフィール初期設定
 */
const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="PasswordSetup"
        options={{
          title: 'パスワード設定',
          headerShown: true,
          animationEnabled: true,
        }}
      >
        {() => <PlaceholderScreen name="Password Setup" />}
      </Stack.Screen>

      <Stack.Screen
        name="PasswordLogin"
        options={{
          title: 'ログイン',
          headerShown: true,
          animationEnabled: true,
        }}
      >
        {() => <PlaceholderScreen name="Password Login" />}
      </Stack.Screen>

      <Stack.Screen
        name="ProfileSetup"
        options={{
          title: 'プロフィール設定',
          headerShown: true,
          animationEnabled: true,
        }}
      >
        {() => <PlaceholderScreen name="Profile Setup" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
