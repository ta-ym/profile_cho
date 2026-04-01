import { getDatabase } from './db';
import { v4 as uuidv4 } from 'crypto';

/**
 * ユーザープロフィール型
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  job?: string;
  avatar_url?: string;
  sharing_settings?: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

/**
 * プロフィール作成
 */
export async function createProfile(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO users (id, name, email, phone, birthday, address, job, avatar_url, sharing_settings, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.email || null,
        data.phone || null,
        data.birthday || null,
        data.address || null,
        data.job || null,
        data.avatar_url || null,
        JSON.stringify(data.sharing_settings || {}),
        now,
        now,
      ]
    );

    return {
      id,
      ...data,
      created_at: now,
      updated_at: now,
    };
  } catch (error) {
    console.error('❌ Failed to create profile:', error);
    throw error;
  }
}

/**
 * プロフィール取得
 */
export async function getProfile(userId: string): Promise<User | null> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<any>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!result) {
      return null;
    }

    return {
      ...result,
      sharing_settings: JSON.parse(result.sharing_settings || '{}'),
    };
  } catch (error) {
    console.error('❌ Failed to get profile:', error);
    throw error;
  }
}

/**
 * プロフィール更新
 */
export async function updateProfile(userId: string, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    // 動的に更新フィールドを構築
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      values.push(data.phone);
    }
    if (data.birthday !== undefined) {
      updates.push('birthday = ?');
      values.push(data.birthday);
    }
    if (data.address !== undefined) {
      updates.push('address = ?');
      values.push(data.address);
    }
    if (data.job !== undefined) {
      updates.push('job = ?');
      values.push(data.job);
    }
    if (data.avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      values.push(data.avatar_url);
    }
    if (data.sharing_settings !== undefined) {
      updates.push('sharing_settings = ?');
      values.push(JSON.stringify(data.sharing_settings));
    }

    if (updates.length === 0) {
      // 更新なし → 既存データを返す
      const user = await getProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(userId);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.runAsync(query, values);

    const updated = await getProfile(userId);
    if (!updated) {
      throw new Error('User not found after update');
    }

    return updated;
  } catch (error) {
    console.error('❌ Failed to update profile:', error);
    throw error;
  }
}

/**
 * プロフィール削除
 */
export async function deleteProfile(userId: string): Promise<void> {
  const db = getDatabase();

  try {
    await db.runAsync('DELETE FROM users WHERE id = ?', [userId]);
    console.log('✅ Profile deleted:', userId);
  } catch (error) {
    console.error('❌ Failed to delete profile:', error);
    throw error;
  }
}

/**
 * 共有設定を更新
 */
export async function updateSharingSettings(
  userId: string,
  settings: Record<string, boolean>
): Promise<void> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      'UPDATE users SET sharing_settings = ?, updated_at = ? WHERE id = ?',
      [JSON.stringify(settings), now, userId]
    );

    console.log('✅ Sharing settings updated');
  } catch (error) {
    console.error('❌ Failed to update sharing settings:', error);
    throw error;
  }
}

/**
 * 特定フィールドの可視性を取得
 */
export async function getFieldVisibility(fieldName: string): Promise<boolean> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<any>(
      'SELECT is_visible FROM profile_fields WHERE field_name = ?',
      [fieldName]
    );

    return result?.is_visible === 1;
  } catch (error) {
    console.error('❌ Failed to get field visibility:', error);
    throw error;
  }
}

/**
 * 全テンプレートフィールドを取得
 */
export async function getAllTemplateFields(): Promise<any[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<any>(
      'SELECT * FROM profile_fields ORDER BY created_at ASC'
    );

    return results || [];
  } catch (error) {
    console.error('❌ Failed to get template fields:', error);
    throw error;
  }
}
