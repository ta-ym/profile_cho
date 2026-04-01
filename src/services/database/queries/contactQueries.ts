import { getDatabase } from './db';
import { v4 as uuidv4 } from 'crypto';

/**
 * 連絡先型
 */
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthday?: string;
  address?: string;
  job?: string;
  avatar_url?: string;
  profile_data?: Record<string, any>;
  received_at: string;
  shared_notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * 連絡先作成
 */
export async function createContact(
  data: Omit<Contact, 'id' | 'created_at' | 'updated_at'>
): Promise<Contact> {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO contacts (id, name, email, phone, birthday, address, job, avatar_url, profile_data, received_at, shared_notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.name,
        data.email || null,
        data.phone || null,
        data.birthday || null,
        data.address || null,
        data.job || null,
        data.avatar_url || null,
        JSON.stringify(data.profile_data || {}),
        data.received_at,
        data.shared_notes || '',
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
    console.error('❌ Failed to create contact:', error);
    throw error;
  }
}

/**
 * 連絡先取得
 */
export async function getContact(contactId: string): Promise<Contact | null> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<any>(
      'SELECT * FROM contacts WHERE id = ?',
      [contactId]
    );

    if (!result) {
      return null;
    }

    return {
      ...result,
      profile_data: JSON.parse(result.profile_data || '{}'),
    };
  } catch (error) {
    console.error('❌ Failed to get contact:', error);
    throw error;
  }
}

/**
 * 全連絡先取得（ページング対応）
 */
export async function getAllContacts(limit = 50, offset = 0): Promise<Contact[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<any>(
      'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return (results || []).map((r) => ({
      ...r,
      profile_data: JSON.parse(r.profile_data || '{}'),
    }));
  } catch (error) {
    console.error('❌ Failed to get all contacts:', error);
    throw error;
  }
}

/**
 * 連絡先更新
 */
export async function updateContact(
  contactId: string,
  data: Partial<Omit<Contact, 'id' | 'created_at' | 'updated_at'>>
): Promise<Contact> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    // 動的に更新フィールドを構築
    const fields = ['name', 'email', 'phone', 'birthday', 'address', 'job', 'avatar_url', 'received_at', 'shared_notes'] as const;
    for (const field of fields) {
      if (field in data && data[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(data[field]);
      }
    }

    if (data.profile_data !== undefined) {
      updates.push('profile_data = ?');
      values.push(JSON.stringify(data.profile_data));
    }

    if (updates.length === 0) {
      const contact = await getContact(contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }
      return contact;
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(contactId);

    const query = `UPDATE contacts SET ${updates.join(', ')} WHERE id = ?`;
    await db.runAsync(query, values);

    const updated = await getContact(contactId);
    if (!updated) {
      throw new Error('Contact not found after update');
    }

    return updated;
  } catch (error) {
    console.error('❌ Failed to update contact:', error);
    throw error;
  }
}

/**
 * 連絡先削除
 */
export async function deleteContact(contactId: string): Promise<void> {
  const db = getDatabase();

  try {
    // カスケード削除で関連データも削除
    await db.runAsync('DELETE FROM person_categories WHERE contact_id = ?', [contactId]);
    await db.runAsync('DELETE FROM free_notes WHERE contact_id = ?', [contactId]);
    await db.runAsync('DELETE FROM contacts WHERE id = ?', [contactId]);

    console.log('✅ Contact and related data deleted:', contactId);
  } catch (error) {
    console.error('❌ Failed to delete contact:', error);
    throw error;
  }
}

/**
 * 連絡先検索（名前またはメールで）
 */
export async function searchContacts(query: string): Promise<Contact[]> {
  const db = getDatabase();
  const searchQuery = `%${query}%`;

  try {
    const results = await db.getAllAsync<any>(
      `SELECT * FROM contacts 
       WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
       ORDER BY created_at DESC`,
      [searchQuery, searchQuery, searchQuery]
    );

    return (results || []).map((r) => ({
      ...r,
      profile_data: JSON.parse(r.profile_data || '{}'),
    }));
  } catch (error) {
    console.error('❌ Failed to search contacts:', error);
    throw error;
  }
}

/**
 * 連絡先の総数を取得
 */
export async function getContactCount(): Promise<number> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<any>('SELECT COUNT(*) as count FROM contacts');
    return result?.count || 0;
  } catch (error) {
    console.error('❌ Failed to get contact count:', error);
    throw error;
  }
}
