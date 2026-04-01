import * as SQLite from 'expo-sqlite';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

// データベースファイル名
const DB_NAME = 'profile_app.db';

// データベースバージョン
const DB_VERSION = 1;

// グローバルDB インスタンス
let database: SQLiteDatabase | null = null;

/**
 * データベース接続を初期化・取得します
 */
export async function initializeDatabase(): Promise<SQLiteDatabase> {
  if (database) {
    return database;
  }

  try {
    // expo-sqlite でデータベースを開く
    database = await openDatabaseAsync(DB_NAME);
    console.log('✅ Database initialized:', DB_NAME);

    // テーブルを作成
    await createTables(database);

    return database;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

/**
 * データベースインスタンスを取得します
 * (初期化済みの場合)
 */
export function getDatabase(): SQLiteDatabase {
  if (!database) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
}

/**
 * 全テーブルを作成します
 */
async function createTables(db: SQLiteDatabase): Promise<void> {
  try {
    // ストレージバージョン管理
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS _schema_version (
        version INTEGER PRIMARY KEY,
        created_at TEXT
      );
    `);

    // 現在のバージョンを確認
    const result = await db.getAllAsync(
      'SELECT version FROM _schema_version WHERE version = ?',
      [DB_VERSION]
    );

    if (result.length === 0) {
      // バージョンが0 → 新規マイグレーション実行
      console.log('🔄 Running migrations...');
      await runMigrations(db);

      // バージョンを記録
      await db.runAsync(
        'INSERT INTO _schema_version (version, created_at) VALUES (?, ?)',
        [DB_VERSION, new Date().toISOString()]
      );

      console.log('✅ All tables created successfully');
    } else {
      console.log('✅ Database schema is up-to-date');
    }
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    throw error;
  }
}

/**
 * マイグレーション実行
 */
async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const migrations = [
    createUsersTable,
    createContactsTable,
    createCategoriesTable,
    createPersonCategoriesTable,
    createProfileFieldsTable,
    createFreeNotesTable,
    createThemesTable,
    createAppSettingsTable,
  ];

  for (const migration of migrations) {
    await migration(db);
  }
}

/**
 * Users テーブル: 自分のプロフィール
 */
async function createUsersTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birthday TEXT,
      address TEXT,
      job TEXT,
      avatar_url TEXT,
      sharing_settings TEXT DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
  `);
  console.log('✅ users table created');
}

/**
 * Contacts テーブル: 受け取った人のプロフィール
 */
async function createContactsTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      birthday TEXT,
      address TEXT,
      job TEXT,
      avatar_url TEXT,
      profile_data TEXT DEFAULT '{}',
      received_at TEXT NOT NULL,
      shared_notes TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
    CREATE INDEX IF NOT EXISTS idx_contacts_received_at ON contacts(received_at);
    CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
  `);
  console.log('✅ contacts table created');
}

/**
 * Categories テーブル: 人のカテゴリ
 */
async function createCategoriesTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT DEFAULT '#2196F3',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
  `);
  console.log('✅ categories table created');
}

/**
 * PersonCategories テーブル: 多対多関連
 */
async function createPersonCategoriesTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS person_categories (
      id TEXT PRIMARY KEY,
      contact_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE(contact_id, category_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_person_categories_contact ON person_categories(contact_id);
    CREATE INDEX IF NOT EXISTS idx_person_categories_category ON person_categories(category_id);
  `);
  console.log('✅ person_categories table created');
}

/**
 * ProfileFields テーブル: テンプレート項目の可視性
 */
async function createProfileFieldsTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS profile_fields (
      id TEXT PRIMARY KEY,
      field_name TEXT NOT NULL UNIQUE,
      field_type TEXT NOT NULL,
      is_visible INTEGER DEFAULT 1,
      is_shareable INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_profile_fields_name ON profile_fields(field_name);
  `);

  // デフォルトフィールドを挿入
  const defaultFields = [
    { id: 'f_name', name: 'name', type: 'text', label: '名前' },
    { id: 'f_email', name: 'email', type: 'email', label: 'メール' },
    { id: 'f_phone', name: 'phone', type: 'tel', label: '電話番号' },
    { id: 'f_birthday', name: 'birthday', type: 'date', label: '誕生日' },
    { id: 'f_address', name: 'address', type: 'text', label: '住所' },
    { id: 'f_job', name: 'job', type: 'text', label: '職業' },
  ];

  for (const field of defaultFields) {
    await db.runAsync(
      `INSERT OR IGNORE INTO profile_fields 
       (id, field_name, field_type, is_visible, is_shareable, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [field.id, field.name, field.type, 1, 1, new Date().toISOString()]
    );
  }

  console.log('✅ profile_fields table created');
}

/**
 * FreeNotes テーブル: 個人メモ（ローカルのみ）
 */
async function createFreeNotesTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS free_notes (
      id TEXT PRIMARY KEY,
      contact_id TEXT,
      note_text TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(contact_id) REFERENCES contacts(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_free_notes_contact ON free_notes(contact_id);
    CREATE INDEX IF NOT EXISTS idx_free_notes_updated_at ON free_notes(updated_at);
  `);
  console.log('✅ free_notes table created');
}

/**
 * Themes テーブル: UIテーマプリセット
 */
async function createThemesTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS themes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      primary_color TEXT NOT NULL,
      secondary_color TEXT NOT NULL,
      background_color TEXT NOT NULL,
      text_color TEXT NOT NULL,
      is_custom INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);
  `);

  // デフォルトテーマを挿入
  const themes = [
    {
      id: 'theme_light',
      name: 'Light',
      primary: '#FF5722',
      secondary: '#2196F3',
      background: '#FFFFFF',
      text: '#000000',
    },
    {
      id: 'theme_dark',
      name: 'Dark',
      primary: '#FF8A65',
      secondary: '#64B5F6',
      background: '#121212',
      text: '#FFFFFF',
    },
  ];

  for (const theme of themes) {
    await db.runAsync(
      `INSERT OR IGNORE INTO themes 
       (id, name, primary_color, secondary_color, background_color, text_color, is_custom, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        theme.id,
        theme.name,
        theme.primary,
        theme.secondary,
        theme.background,
        theme.text,
        0,
        new Date().toISOString(),
      ]
    );
  }

  console.log('✅ themes table created');
}

/**
 * AppSettings テーブル: アプリ設定全般
 */
async function createAppSettingsTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);
  `);
  console.log('✅ app_settings table created');
}

/**
 * データベースをリセット（開発用）
 */
export async function resetDatabase(): Promise<void> {
  if (!database) {
    throw new Error('Database not initialized');
  }

  try {
    await database.execAsync(`
      DROP TABLE IF EXISTS _schema_version;
      DROP TABLE IF EXISTS person_categories;
      DROP TABLE IF EXISTS free_notes;
      DROP TABLE IF EXISTS contacts;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS profile_fields;
      DROP TABLE IF EXISTS themes;
      DROP TABLE IF EXISTS app_settings;
    `);

    // 再初期化
    await createTables(database);
    console.log('✅ Database reset complete');
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
    throw error;
  }
}

/**
 * データベースを閉じます
 */
export async function closeDatabase(): Promise<void> {
  if (database) {
    await database.closeAsync();
    database = null;
    console.log('✅ Database closed');
  }
}
