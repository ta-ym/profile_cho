import { getDatabase } from './db';
import { v4 as uuidv4 } from 'crypto';

/**
 * カテゴリ型
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

/**
 * カテゴリ作成
 */
export async function createCategory(
  data: Omit<Category, 'id' | 'created_at' | 'updated_at'>
): Promise<Category> {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO categories (id, name, color, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, data.name, data.color || '#2196F3', now, now]
    );

    return {
      id,
      ...data,
      color: data.color || '#2196F3',
      created_at: now,
      updated_at: now,
    };
  } catch (error) {
    console.error('❌ Failed to create category:', error);
    throw error;
  }
}

/**
 * カテゴリ取得
 */
export async function getCategory(categoryId: string): Promise<Category | null> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<Category>(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    return result || null;
  } catch (error) {
    console.error('❌ Failed to get category:', error);
    throw error;
  }
}

/**
 * 全カテゴリ取得
 */
export async function getAllCategories(): Promise<Category[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<Category>(
      'SELECT * FROM categories ORDER BY created_at ASC'
    );

    return results || [];
  } catch (error) {
    console.error('❌ Failed to get all categories:', error);
    throw error;
  }
}

/**
 * カテゴリ更新
 */
export async function updateCategory(
  categoryId: string,
  data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
): Promise<Category> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }

    if (data.color !== undefined) {
      updates.push('color = ?');
      values.push(data.color);
    }

    if (updates.length === 0) {
      const category = await getCategory(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(categoryId);

    const query = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    await db.runAsync(query, values);

    const updated = await getCategory(categoryId);
    if (!updated) {
      throw new Error('Category not found after update');
    }

    return updated;
  } catch (error) {
    console.error('❌ Failed to update category:', error);
    throw error;
  }
}

/**
 * カテゴリ削除
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  const db = getDatabase();

  try {
    // カスケード削除で関連データも削除
    await db.runAsync('DELETE FROM person_categories WHERE category_id = ?', [categoryId]);
    await db.runAsync('DELETE FROM categories WHERE id = ?', [categoryId]);

    console.log('✅ Category and related assignments deleted:', categoryId);
  } catch (error) {
    console.error('❌ Failed to delete category:', error);
    throw error;
  }
}

/**
 * 人にカテゴリを割当
 */
export async function assignCategory(contactId: string, categoryId: string): Promise<void> {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO person_categories (id, contact_id, category_id, created_at)
       VALUES (?, ?, ?, ?)`,
      [id, contactId, categoryId, now]
    );

    console.log('✅ Category assigned to contact:', { contactId, categoryId });
  } catch (error) {
    console.error('❌ Failed to assign category:', error);
    throw error;
  }
}

/**
 * 人からカテゴリを削除
 */
export async function unassignCategory(contactId: string, categoryId: string): Promise<void> {
  const db = getDatabase();

  try {
    await db.runAsync(
      'DELETE FROM person_categories WHERE contact_id = ? AND category_id = ?',
      [contactId, categoryId]
    );

    console.log('✅ Category unassigned from contact:', { contactId, categoryId });
  } catch (error) {
    console.error('❌ Failed to unassign category:', error);
    throw error;
  }
}

/**
 * 人のカテゴリ一覧を取得
 */
export async function getCategoriesForContact(contactId: string): Promise<Category[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<Category>(
      `SELECT c.* FROM categories c
       INNER JOIN person_categories pc ON c.id = pc.category_id
       WHERE pc.contact_id = ?
       ORDER BY c.created_at ASC`,
      [contactId]
    );

    return results || [];
  } catch (error) {
    console.error('❌ Failed to get categories for contact:', error);
    throw error;
  }
}

/**
 * カテゴリに割当てられた人一覧を取得
 */
export async function getContactsForCategory(categoryId: string): Promise<string[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<{ contact_id: string }>(
      'SELECT contact_id FROM person_categories WHERE category_id = ? ORDER BY created_at ASC',
      [categoryId]
    );

    return (results || []).map((r) => r.contact_id);
  } catch (error) {
    console.error('❌ Failed to get contacts for category:', error);
    throw error;
  }
}

/**
 * 複数カテゴリで人をフィルタリング
 */
export async function getContactsInCategories(categoryIds: string[]): Promise<string[]> {
  if (categoryIds.length === 0) {
    throw new Error('At least one category ID is required');
  }

  const db = getDatabase();
  const placeholders = categoryIds.map(() => '?').join(',');

  try {
    const results = await db.getAllAsync<{ contact_id: string }>(
      `SELECT DISTINCT contact_id FROM person_categories WHERE category_id IN (${placeholders})`,
      categoryIds
    );

    return (results || []).map((r) => r.contact_id);
  } catch (error) {
    console.error('❌ Failed to get contacts in categories:', error);
    throw error;
  }
}
