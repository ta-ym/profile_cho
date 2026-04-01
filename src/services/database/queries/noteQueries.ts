import { getDatabase } from './db';
import { v4 as uuidv4 } from 'crypto';

/**
 * フリーノート型
 */
export interface FreeNote {
  id: string;
  contact_id: string;
  note_text: string;
  created_at: string;
  updated_at: string;
}

/**
 * ノート作成
 */
export async function createNote(
  contactId: string,
  noteText: string
): Promise<FreeNote> {
  const db = getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `INSERT INTO free_notes (id, contact_id, note_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, contactId, noteText, now, now]
    );

    return {
      id,
      contact_id: contactId,
      note_text: noteText,
      created_at: now,
      updated_at: now,
    };
  } catch (error) {
    console.error('❌ Failed to create note:', error);
    throw error;
  }
}

/**
 * ノート取得
 */
export async function getNote(noteId: string): Promise<FreeNote | null> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<FreeNote>(
      'SELECT * FROM free_notes WHERE id = ?',
      [noteId]
    );

    return result || null;
  } catch (error) {
    console.error('❌ Failed to get note:', error);
    throw error;
  }
}

/**
 * 人のノート一覧を取得
 */
export async function getNotesForContact(contactId: string): Promise<FreeNote[]> {
  const db = getDatabase();

  try {
    const results = await db.getAllAsync<FreeNote>(
      `SELECT * FROM free_notes WHERE contact_id = ? ORDER BY created_at DESC`,
      [contactId]
    );

    return results || [];
  } catch (error) {
    console.error('❌ Failed to get notes for contact:', error);
    throw error;
  }
}

/**
 * ノート更新
 */
export async function updateNote(noteId: string, noteText: string): Promise<FreeNote> {
  const db = getDatabase();
  const now = new Date().toISOString();

  try {
    await db.runAsync(
      `UPDATE free_notes SET note_text = ?, updated_at = ? WHERE id = ?`,
      [noteText, now, noteId]
    );

    const updated = await getNote(noteId);
    if (!updated) {
      throw new Error('Note not found after update');
    }

    return updated;
  } catch (error) {
    console.error('❌ Failed to update note:', error);
    throw error;
  }
}

/**
 * ノート削除
 */
export async function deleteNote(noteId: string): Promise<void> {
  const db = getDatabase();

  try {
    await db.runAsync('DELETE FROM free_notes WHERE id = ?', [noteId]);
    console.log('✅ Note deleted:', noteId);
  } catch (error) {
    console.error('❌ Failed to delete note:', error);
    throw error;
  }
}

/**
 * 人の全ノートを削除
 */
export async function deleteNotesForContact(contactId: string): Promise<void> {
  const db = getDatabase();

  try {
    await db.runAsync('DELETE FROM free_notes WHERE contact_id = ?', [contactId]);
    console.log('✅ All notes deleted for contact:', contactId);
  } catch (error) {
    console.error('❌ Failed to delete notes for contact:', error);
    throw error;
  }
}

/**
 * ノート検索（テキスト検索）
 */
export async function searchNotes(query: string): Promise<FreeNote[]> {
  const db = getDatabase();
  const searchPattern = `%${query}%`;

  try {
    const results = await db.getAllAsync<FreeNote>(
      `SELECT * FROM free_notes WHERE note_text LIKE ? ORDER BY updated_at DESC`,
      [searchPattern]
    );

    return results || [];
  } catch (error) {
    console.error('❌ Failed to search notes:', error);
    throw error;
  }
}

/**
 * 人のノート数を取得
 */
export async function getNoteCountForContact(contactId: string): Promise<number> {
  const db = getDatabase();

  try {
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM free_notes WHERE contact_id = ?',
      [contactId]
    );

    return result?.count || 0;
  } catch (error) {
    console.error('❌ Failed to get note count:', error);
    throw error;
  }
}
