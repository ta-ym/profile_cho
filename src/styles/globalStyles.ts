/**
 * src/styles/globalStyles.ts
 * グローバルスタイル定義
 */

import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';
import { Spacing, Padding } from '@/styles/spacing';
import { Typography, TextStyles } from '@/styles/typography';

/**
 * コンテナスタイル
 */
export const ContainerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  screenDark: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  screenPadded: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: Padding.screenPadding,
  },

  screenPaddedDark: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: Padding.screenPadding,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  spacedBetween: {
    justifyContent: 'space-between',
  },
});

/**
 * テキストスタイル
 */
export const GlobalTextStyles = StyleSheet.create({
  h1: {
    ...TextStyles.h1,
    color: Colors.light.text,
  },

  h1Dark: {
    ...TextStyles.h1,
    color: Colors.dark.text,
  },

  h2: {
    ...TextStyles.h2,
    color: Colors.light.text,
  },

  h2Dark: {
    ...TextStyles.h2,
    color: Colors.dark.text,
  },

  h3: {
    ...TextStyles.h3,
    color: Colors.light.text,
  },

  h3Dark: {
    ...TextStyles.h3,
    color: Colors.dark.text,
  },

  body: {
    ...TextStyles.body,
    color: Colors.light.text,
  },

  bodyDark: {
    ...TextStyles.body,
    color: Colors.dark.text,
  },

  bodySecondary: {
    ...TextStyles.body,
    color: Colors.light.textSecondary,
  },

  bodySecondaryDark: {
    ...TextStyles.body,
    color: Colors.dark.textSecondary,
  },

  caption: {
    ...TextStyles.caption,
    color: Colors.light.textSecondary,
  },

  captionDark: {
    ...TextStyles.caption,
    color: Colors.dark.textSecondary,
  },

  label: {
    ...TextStyles.label,
    color: Colors.light.text,
  },

  labelDark: {
    ...TextStyles.label,
    color: Colors.dark.text,
  },

  button: {
    ...TextStyles.button,
    color: Colors.light.text,
  },

  buttonDark: {
    ...TextStyles.button,
    color: Colors.dark.text,
  },

  link: {
    ...TextStyles.button,
    color: Colors.light.primary,
  },

  linkDark: {
    ...TextStyles.button,
    color: Colors.dark.primary,
  },
});

/**
 * 境界線スタイル
 */
export const BorderStyles = StyleSheet.create({
  border: {
    borderWidth: 1,
    borderColor: Colors.light.border,
  },

  borderDark: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },

  borderTopDark: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },

  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },

  borderBottomDark: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },

  rounded: {
    borderRadius: 8,
  },

  roundedLarge: {
    borderRadius: 16,
  },

  roundedFull: {
    borderRadius: 999,
  },
});

/**
 * 影スタイル
 */
export const ShadowStyles = StyleSheet.create({
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },

  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,
    elevation: 6,
  },

  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 7.84,
    elevation: 9,
  },
});

/**
 * Opacityスタイル
 */
export const OpacityStyles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },

  fade: {
    opacity: 0.6,
  },

  subtle: {
    opacity: 0.8,
  },
});
