import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/store/themeStore';
import {
  HomeTabParamList,
  ProfileTabParamList,
  SettingsTabParamList,
  MainTabsParamList,
} from '@/navigation/types';

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

const HomeStack = createNativeStackNavigator<HomeTabParamList>();
const ProfileStack = createNativeStackNavigator<ProfileTabParamList>();
const SettingsStack = createNativeStackNavigator<SettingsTabParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

/**
 * ホームスタック
 */
const HomeStackNavigator: React.FC = () => {
  const { current } = useThemeStore();

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerTintColor: current.primary_color,
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        options={{
          title: 'コンタクト',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Home Screen" />}
      </HomeStack.Screen>

      <HomeStack.Screen
        name="ContactDetail"
        options={{
          title: 'コンタクト詳細',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Contact Detail" />}
      </HomeStack.Screen>

      <HomeStack.Screen
        name="ContactSearch"
        options={{
          title: 'コンタクト検索',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Contact Search" />}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
};

/**
 * プロフィールスタック
 */
const ProfileStackNavigator: React.FC = () => {
  const { current } = useThemeStore();

  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerTintColor: current.primary_color,
      }}
    >
      <ProfileStack.Screen
        name="ProfileScreen"
        options={{
          title: 'マイプロフィール',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="My Profile" />}
      </ProfileStack.Screen>

      <ProfileStack.Screen
        name="ProfileEdit"
        options={{
          title: 'プロフィール編集',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Profile Edit" />}
      </ProfileStack.Screen>

      <ProfileStack.Screen
        name="QRShare"
        options={{
          title: 'QRコード共有',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="QR Share" />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};

/**
 * 設定スタック
 */
const SettingsStackNavigator: React.FC = () => {
  const { current } = useThemeStore();

  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerTitleAlign: 'center',
        headerTintColor: current.primary_color,
      }}
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        options={{
          title: '設定',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Settings" />}
      </SettingsStack.Screen>

      <SettingsStack.Screen
        name="CategoryManagement"
        options={{
          title: 'カテゴリ管理',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Category Management" />}
      </SettingsStack.Screen>

      <SettingsStack.Screen
        name="ThemeSettings"
        options={{
          title: 'テーマ設定',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="Theme Settings" />}
      </SettingsStack.Screen>

      <SettingsStack.Screen
        name="AppSettings"
        options={{
          title: 'アプリ設定',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="App Settings" />}
      </SettingsStack.Screen>

      <SettingsStack.Screen
        name="About"
        options={{
          title: 'について',
          headerShown: true,
        }}
      >
        {() => <PlaceholderScreen name="About" />}
      </SettingsStack.Screen>
    </SettingsStack.Navigator>
  );
};

/**
 * メインナビゲーター (ボトムタブ)
 */
const MainNavigator: React.FC = () => {
  const { current } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: current.primary_color,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: current.background_color,
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'コンタクト',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'プロフィール',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: '設定',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
