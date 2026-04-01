import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/styles/colors';
import { Spacing, Padding } from '@/styles/spacing';
import { Typography, TextStyles } from '@/styles/typography';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
  icon?: React.ReactNode;
}

/**
 * 入力フィールドコンポーネント
 */
const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  required = false,
  containerStyle,
  multiline = false,
  numberOfLines = 1,
  icon,
  ...props
}) => {
  const { current, isDarkMode } = useThemeStore();
  const isDark = isDarkMode;
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused
    ? current.primary_color
    : error
      ? Colors.light.error
      : isDark
        ? Colors.dark.border
        : Colors.light.border;

  const backgroundColor = isDark ? Colors.dark.surface : Colors.light.surface;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const placeholderColor = isDark ? Colors.dark.textSecondary : Colors.light.textSecondary;
  const labelColor = isDark ? Colors.dark.text : Colors.light.text;
  const errorColor = Colors.light.error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: labelColor }]}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              paddingLeft: icon ? Spacing.sm : Padding.inputPadding,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
      </View>

      {error && <Text style={[styles.error, { color: errorColor }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.base,
  },

  labelContainer: {
    marginBottom: Spacing.sm,
  },

  label: {
    ...TextStyles.label,
    fontWeight: '600',
  },

  required: {
    color: Colors.light.error,
    marginLeft: 2,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Padding.inputPadding,
    minHeight: 40,
  },

  iconContainer: {
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    ...TextStyles.body,
    paddingVertical: Spacing.sm,
    paddingRight: Padding.inputPadding,
  },

  error: {
    ...TextStyles.caption,
    marginTop: Spacing.xs,
  },
});

export default Input;
