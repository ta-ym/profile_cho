import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  Modal,
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/styles/colors';
import { Spacing, Padding } from '@/styles/spacing';
import { TextStyles } from '@/styles/typography';

interface LoadingProps {
  visible: boolean;
  message?: string;
  size?: 'small' | 'large';
  containerStyle?: ViewStyle;
  fullScreen?: boolean;
}

/**
 * ローディングコンポーネント
 */
const Loading: React.FC<LoadingProps> = ({
  visible,
  message,
  size = 'large',
  containerStyle,
  fullScreen = true,
}) => {
  const { current, isDarkMode } = useThemeStore();
  const isDark = isDarkMode;

  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)';

  const loadingContent = (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        {
          backgroundColor: fullScreen ? overlayColor : backgroundColor,
        },
        containerStyle,
      ]}
    >
      <View
        style={[
          styles.content,
          {
            backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
          },
        ]}
      >
        <ActivityIndicator
          size={size}
          color={current.primary_color}
          style={styles.spinner}
        />
        {message && (
          <Text
            style={[
              styles.message,
              {
                color: textColor,
              },
            ]}
          >
            {message}
          </Text>
        )}
      </View>
    </View>
  );

  if (fullScreen) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        {loadingContent}
      </Modal>
    );
  }

  return visible ? loadingContent : null;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullScreen: {
    flex: 1,
  },

  content: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 150,
  },

  spinner: {
    marginBottom: Spacing.base,
  },

  message: {
    ...TextStyles.body,
    textAlign: 'center',
    marginTop: Spacing.base,
  },
});

export default Loading;
