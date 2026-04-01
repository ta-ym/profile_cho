/**
 * src/styles/spacing.ts
 * 間隔 (パディング、マージン) 定義
 */

export const Spacing = {
  // Base spacing unit (4px)
  xs: 4,      // 4px
  sm: 8,      // 8px
  md: 12,     // 12px
  base: 16,   // 16px
  lg: 20,     // 20px
  xl: 24,     // 24px
  '2xl': 32,  // 32px
  '3xl': 40,  // 40px
  '4xl': 48,  // 48px
};

/**
 * 共通なパディング値
 */
export const Padding = {
  // ボタン
  buttonVertical: Spacing.base,
  buttonHorizontal: Spacing.lg,

  // カード
  cardPadding: Spacing.base,

  // 入力フィールド
  inputPadding: Spacing.base,

  // スクリーン
  screenPadding: Spacing.base,

  // セクション
  sectionPadding: Spacing.xl,
};

/**
 * 共通なマージン値
 */
export const Margin = {
  // セクション間
  sectionMargin: Spacing.xl,
  componentMargin: Spacing.md,

  // テキスト
  textMargin: Spacing.base,
};

/**
 * キャッシュ済みスタイル
 */
export const SpacingStyles = {
  // パディング
  p0: { padding: 0 },
  p1: { padding: Spacing.xs },
  p2: { padding: Spacing.sm },
  p3: { padding: Spacing.md },
  p4: { padding: Spacing.base },
  p5: { padding: Spacing.lg },
  p6: { padding: Spacing.xl },

  // マージン
  m0: { margin: 0 },
  m1: { margin: Spacing.xs },
  m2: { margin: Spacing.sm },
  m3: { margin: Spacing.md },
  m4: { margin: Spacing.base },
  m5: { margin: Spacing.lg },
  m6: { margin: Spacing.xl },

  // ギャップ (フレックスレイアウト用)
  gap1: { gap: Spacing.xs },
  gap2: { gap: Spacing.sm },
  gap3: { gap: Spacing.md },
  gap4: { gap: Spacing.base },
  gap5: { gap: Spacing.lg },
  gap6: { gap: Spacing.xl },
};
