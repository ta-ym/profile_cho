import { create } from 'zustand';
import { Theme, ThemeState } from '@/types/models';

/**
 * テーマストア
 * UI カラースキーム管理
 */
interface ThemeStore extends ThemeState {
  setTheme: (theme: Theme) => void;
  setDarkMode: (isDark: boolean) => void;
  setCustomColors: (colors: Record<string, string>) => void;
  applyCustomTheme: (theme: Theme) => void;
  resetToDefaults: () => void;
}

// デフォルトテーマ (ライトモード)
const DEFAULT_LIGHT_THEME: Theme = {
  id: 'light',
  name: 'Light',
  primary_color: '#FF5722',
  secondary_color: '#2196F3',
  accent_color: '#4CAF50',
  background_color: '#FFFFFF',
  is_custom: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// デフォルトテーマ (ダークモード)
const DEFAULT_DARK_THEME: Theme = {
  id: 'dark',
  name: 'Dark',
  primary_color: '#FF6D00',
  secondary_color: '#42A5F5',
  accent_color: '#66BB6A',
  background_color: '#121212',
  is_custom: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  current: DEFAULT_LIGHT_THEME,
  isDarkMode: false,
  customColors: {},

  setTheme: (theme: Theme) => {
    set({
      current: theme,
      isDarkMode: theme.id === 'dark' || theme.name.toLowerCase().includes('dark'),
    });
  },

  setDarkMode: (isDark: boolean) => {
    const theme = isDark ? DEFAULT_DARK_THEME : DEFAULT_LIGHT_THEME;
    set({
      isDarkMode: isDark,
      current: theme,
    });
  },

  setCustomColors: (colors: Record<string, string>) => {
    set((state) => ({
      customColors: colors,
      current: {
        ...state.current,
        primary_color: colors.primary || state.current.primary_color,
        secondary_color: colors.secondary || state.current.secondary_color,
        accent_color: colors.accent || state.current.accent_color,
        background_color: colors.background || state.current.background_color,
      },
    }));
  },

  applyCustomTheme: (theme: Theme) => {
    set({
      current: {
        ...theme,
        is_custom: true,
        updated_at: new Date().toISOString(),
      },
      customColors: {
        primary: theme.primary_color,
        secondary: theme.secondary_color,
        accent: theme.accent_color,
        background: theme.background_color,
      },
    });
  },

  resetToDefaults: () => {
    set({
      current: DEFAULT_LIGHT_THEME,
      isDarkMode: false,
      customColors: {},
    });
  },
}));

/**
 * テーマ色を取得するヘルパー関数
 */
export const getThemeColors = (isDark?: boolean) => {
  const { current } = useThemeStore.getState();
  return {
    primary: current.primary_color,
    secondary: current.secondary_color,
    accent: current.accent_color,
    background: current.background_color,
  };
};

/**
 * カスタムテーマを検証するヘルパー
 */
export const validateThemeColors = (colors: Record<string, string>): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const requiredColors = ['primary_color', 'secondary_color', 'accent_color', 'background_color'];

  for (const color of requiredColors) {
    if (!colors[color] || !hexColorRegex.test(colors[color])) {
      console.error(`❌ Invalid color for ${color}:`, colors[color]);
      return false;
    }
  }

  return true;
};
