import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/styles/colors';
import { Spacing, Padding } from '@/styles/spacing';
import { ShadowStyles, BorderStyles } from '@/styles/globalStyles';

interface CardProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  padding?: number;
  shadow?: 'small' | 'medium' | 'large' | 'none';
  variant?: 'default' | 'elevated' | 'outlined';
  rounded?: 'small' | 'medium' | 'large';
}

/**
 * カードコンポーネント
 */
const Card: React.FC<CardProps> = ({
  children,
  containerStyle,
  padding = Padding.cardPadding,
  shadow = 'small',
  variant = 'default',
  rounded = 'medium',
}) => {
  const { current, isDarkMode } = useThemeStore();
  const isDark = isDarkMode;

  const backgroundColor = isDark ? Colors.dark.surface : Colors.light.surface;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;

  const getBackgroundColor = () => {
    if (variant === 'outlined') {
      return 'transparent';
    }
    return backgroundColor;
  };

  const getBorderColor = () => {
    if (variant === 'outlined') {
      return borderColor;
    }
    return 'transparent';
  };

  const getBorderWidth = () => {
    if (variant === 'outlined') {
      return 1;
    }
    return 0;
  };

  const getRoundedStyle = () => {
    switch (rounded) {
      case 'small':
        return { borderRadius: 4 };
      case 'large':
        return { borderRadius: 16 };
      case 'medium':
      default:
        return { borderRadius: 8 };
    }
  };

  const getShadowStyle = () => {
    if (shadow === 'none') {
      return {};
    }
    return ShadowStyles[shadow] || {};
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderWidth: getBorderWidth(),
      padding,
    },
    getRoundedStyle(),
    getShadowStyle(),
    containerStyle,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.xs,
  },
});

export default Card;
