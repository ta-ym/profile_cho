/**
 * src/navigation/types.ts
 * ナビゲーション型定義
 */

import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';

/**
 * ルートナビゲーションパラメータ
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

/**
 * 認証フローパラメータ
 */
export type AuthStackParamList = {
  PasswordSetup: undefined;
  PasswordLogin: undefined;
  ProfileSetup: undefined;
};

/**
 * メインフローパラメータ
 */
export type MainStackParamList = {
  Home: undefined;
  ProfileTab: undefined;
  SettingsTab: undefined;
  ContactDetail: { contactId: string };
  ProfileEdit: undefined;
  CategoryManagement: undefined;
  QRShare: undefined;
  ThemeSettings: undefined;
  AppSettings: undefined;
};

/**
 * ホームタブパラメータ
 */
export type HomeTabParamList = {
  HomeScreen: undefined;
  ContactDetail: { contactId: string };
  ContactSearch: undefined;
};

/**
 * プロフィールタブパラメータ
 */
export type ProfileTabParamList = {
  ProfileScreen: undefined;
  ProfileEdit: undefined;
  QRShare: undefined;
};

/**
 * 設定タブパラメータ
 */
export type SettingsTabParamList = {
  SettingsScreen: undefined;
  CategoryManagement: undefined;
  ThemeSettings: undefined;
  AppSettings: undefined;
  About: undefined;
};

/**
 * ナビゲーション型 - RootNavigator
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

/**
 * ナビゲーション型 - AuthNavigator
 */
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

/**
 * ナビゲーション型 - HomeStack
 */
export type HomeStackScreenProps<T extends keyof HomeTabParamList> = NativeStackScreenProps<
  HomeTabParamList,
  T
>;

/**
 * ナビゲーション型 - ProfileStack
 */
export type ProfileStackScreenProps<T extends keyof ProfileTabParamList> = NativeStackScreenProps<
  ProfileTabParamList,
  T
>;

/**
 * ナビゲーション型 - SettingsStack
 */
export type SettingsStackScreenProps<T extends keyof SettingsTabParamList> = NativeStackScreenProps<
  SettingsTabParamList,
  T
>;

/**
 * ナビゲーション型 - BottomTabNavigator
 */
export type MainTabsParamList = {
  HomeStack: undefined;
  ProfileStack: undefined;
  SettingsStack: undefined;
};

export type MainTabsScreenProps<T extends keyof MainTabsParamList> = BottomTabScreenProps<
  MainTabsParamList,
  T
>;

/**
 * コンポーザイト型 - HomeTabからルートへのナビゲーション
 */
export type HomeTabNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * コンポーザイト型 - ProfileTabからルートへのナビゲーション
 */
export type ProfileTabNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * コンポーザイト型 - SettingsTabからルートへのナビゲーション
 */
export type SettingsTabNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<SettingsTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * コンポーザイト型 - MainTabsからRootへのナビゲーション
 */
export type MainTabsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * ナビゲーション型定義ヘルパー
 */
export declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
