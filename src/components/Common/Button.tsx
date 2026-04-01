import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/styles/colors';
import { Spacing, Padding } from '@/styles/spacing';
import { TextStyles } from '@/styles/typography';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

/**
 * ボタンコンポーネント
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  ...props
}) => {
  const { current, isDarkMode } = useThemeStore();
  const isDark = isDarkMode;

  const getBackgroundColor = () => {
    if (disabled) {
      return Colors.disabled;
    }

    switch (variant) {
      case 'primary':
        return current.primary_color;
      case 'secondary':
        return current.secondary_color;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return current.primary_color;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return current.primary_color;
    }
    return 'transparent';
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return current.primary_color;
    }
    return '#FFFFFF';
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          minHeight: 32,
        };
      case 'large':
        return {
          paddingVertical: Spacing.lg,
          paddingHorizontal: Spacing.xl,
          minHeight: 48,
        };
      case 'medium':
      default:
        return {
          paddingVertical: Spacing.base,
          paddingHorizontal: Spacing.lg,
          minHeight: 40,
        };
    }
  };

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: getBackgroundColor(),
      borderColor: getBorderColor(),
      borderWidth: variant === 'outline' ? 2 : 0,
      width: fullWidth ? '100%' : 'auto',
    },
    getSizeStyle(),
    style,
  ];

  const textColorStyle = {
    color: getTextColor(),
    ...TextStyles.button,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {icon && <>{icon}</>}
      <Text style={[textColorStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
  },
});

export default Button;
