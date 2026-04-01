import React from 'react';
import {
  Modal,
  ModalProps,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { Colors } from '@/styles/colors';
import { Spacing, Padding } from '@/styles/spacing';
import { TextStyles } from '@/styles/typography';
import { ShadowStyles, BorderStyles } from '@/styles/globalStyles';
import Button from '@/components/Common/Button';

interface CustomModalProps extends Omit<ModalProps, 'visible' | 'transparent' | 'animationType'> {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  primaryButtonText?: string;
  primaryButtonOnPress?: () => void;
  secondaryButtonText?: string;
  secondaryButtonOnPress?: () => void;
  showCloseButton?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * モーダルコンポーネント
 */
const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  children,
  primaryButtonText,
  primaryButtonOnPress,
  secondaryButtonText,
  secondaryButtonOnPress,
  showCloseButton = true,
  containerStyle,
  ...props
}) => {
  const { current, isDarkMode } = useThemeStore();
  const isDark = isDarkMode;

  const backgroundColor = isDark ? Colors.dark.background : Colors.light.background;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const overlayColor = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      {...props}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View
          style={[
            styles.centeredView,
          ]}
        >
          <View
            style={[
              styles.modalView,
              {
                backgroundColor,
              },
              ShadowStyles.large,
              containerStyle,
            ]}
          >
            {/* Header */}
            {title && (
              <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Text style={[styles.closeButtonText, { color: textColor }]}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Content */}
            <View style={styles.content}>{children}</View>

            {/* Footer */}
            {(primaryButtonText || secondaryButtonText) && (
              <View style={styles.footer}>
                {secondaryButtonText && (
                  <Button
                    title={secondaryButtonText}
                    onPress={secondaryButtonOnPress || onClose}
                    variant="outline"
                    size="medium"
                    style={{ flex: 1, marginRight: Spacing.sm }}
                  />
                )}
                {primaryButtonText && (
                  <Button
                    title={primaryButtonText}
                    onPress={primaryButtonOnPress || onClose}
                    variant="primary"
                    size="medium"
                    style={{ flex: 1 }}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },

  modalView: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    paddingVertical: Padding.cardPadding,
    paddingHorizontal: Padding.cardPadding,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  title: {
    ...TextStyles.h4,
    fontWeight: '600',
    flex: 1,
  },

  closeButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.base,
  },

  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },

  content: {
    marginVertical: Spacing.base,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.lg,
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default CustomModal;
