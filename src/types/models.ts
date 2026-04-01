/**
 * src/types/models.ts
 * ドメインモデルの型定義
 */

/**
 * ユーザー (自身のプロフィール)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday: string; // ISO 8601 date
  address: string;
  job: string;
  avatar_url: string | null;
  sharing_settings: Record<string, boolean>; // { name: true, email: false, ... }
  created_at: string; // ISO 8601 timestamp
  updated_at: string;
}

/**
 * コンタクト (受け取ったプロフィール)
 */
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  job: string;
  avatar_url: string | null;
  profile_data: Record<string, any>; // 受け取ったプロフィール全データ
  received_at: string; // ISO 8601 timestamp
  shared_notes: string | null; // 相手から追加されたメモ
  created_at: string;
  updated_at: string;
}

/**
 * カテゴリ (タグ)
 */
export interface Category {
  id: string;
  name: string; // UNIQUE
  color: string; // hex color code
  created_at: string;
  updated_at: string;
}

/**
 * プロフィールフィールド定義
 */
export interface ProfileField {
  field_name: string; // UNIQUE (name, email, phone, etc)
  field_type: string; // text, date, email, etc.
  is_visible: boolean; // UI表示フラグ
  is_shareable: boolean; // QR共有時の許可フラグ
  created_at: string;
  updated_at: string;
}

/**
 * フリーノート (自分用メモ)
 */
export interface FreeNote {
  id: string;
  contact_id: string; // コンタクトへのメモ
  note_text: string;
  created_at: string;
  updated_at: string;
}

/**
 * テーマ設定
 */
export interface Theme {
  id: string;
  name: string;
  primary_color: string; // hex color
  secondary_color: string;
  accent_color: string;
  background_color: string;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * アプリ設定 (キー・バリュー)
 */
export interface AppSettings {
  key: string; // UNIQUE
  value: string;
  updated_at: string;
}

/**
 * PersonCategories (M2M junction table)
 * DB内部用、主にクエリで使用
 */
export interface PersonCategory {
  id: string;
  contact_id: string;
  category_id: string;
  created_at: string;
}

/**
 * プロフィール全体 (複合データ)
 * UI表示用に複数テーブルをマージしたデータ
 */
export interface ProfileWithCategories extends User {
  categories: Category[];
  notes: FreeNote[];
}

/**
 * コンタクト全体 (複合データ)
 */
export interface ContactWithDetails extends Contact {
  categories: Category[];
  notes: FreeNote[];
  lastContactedAt?: string;
}

/**
 * パラメータ型
 */
export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  job: string;
  avatar_url?: string;
  sharing_settings?: Record<string, boolean>;
}

export interface UpdateUserParams {
  name?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  job?: string;
  avatar_url?: string;
  sharing_settings?: Record<string, boolean>;
}

export interface CreateContactParams {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  address: string;
  job: string;
  avatar_url?: string;
  profile_data: Record<string, any>;
  received_at?: string;
  shared_notes?: string;
}

export interface UpdateContactParams {
  name?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  job?: string;
  avatar_url?: string;
  profile_data?: Record<string, any>;
  shared_notes?: string;
}

export interface CreateCategoryParams {
  name: string;
  color?: string;
}

export interface UpdateCategoryParams {
  name?: string;
  color?: string;
}

/**
 * ストア状態型
 */
export interface AuthState {
  isAuthenticated: boolean;
  passwordHash: string | null;
}

export interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isLoading: boolean;
  searchQuery: string;
  error: string | null;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeState {
  current: Theme;
  isDarkMode: boolean;
  customColors: Record<string, string>;
}

export interface SyncState {
  status: 'idle' | 'syncing' | 'error' | 'success';
  lastSyncTime: string | null;
  errorMessage: string | null;
  progress: number; // 0-100
}

/**
 * API レスポンス型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * QR コードペイロード
 */
export interface QRCodePayload {
  version: string;
  profile: Omit<User, 'sharing_settings'> & {
    shareable_fields: Record<string, boolean>;
  };
  expiresAt: string;
}

/**
 * セッション情報
 */
export interface SessionInfo {
  userId: string;
  isAuthenticated: boolean;
  lastActivityAt: string;
  device: string;
  appVersion: string;
}
