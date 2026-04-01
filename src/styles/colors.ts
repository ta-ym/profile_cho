/**
 * src/styles/colors.ts
 * カラーパレット定義
 */

export const Colors = {
  // Light Theme
  light: {
    primary: '#FF5722',
    secondary: '#2196F3',
    accent: '#4CAF50',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
  },

  // Dark Theme
  dark: {
    primary: '#FF6D00',
    secondary: '#42A5F5',
    accent: '#66BB6A',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    error: '#CF6679',
    warning: '#FFB74D',
    success: '#81C784',
    info: '#64B5F6',
  },

  // Utility
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  disabled: '#BDBDBD',
  placeholder: '#9E9E9E',
};

/**
 * テーマに基づく色を取得
 */
export const getColor = (colorName: keyof typeof Colors.light, isDark: boolean = false) => {
  return isDark ? Colors.dark[colorName] : Colors.light[colorName];
};
