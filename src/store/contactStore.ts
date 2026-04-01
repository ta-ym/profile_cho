import { create } from 'zustand';
import { Contact, ContactState, CreateContactParams, UpdateContactParams } from '@/types/models';
import * as contactQueries from '@/services/database/queries/contactQueries';

/**
 * コンタクトストア
 * 受け取ったプロフィール管理
 */
interface ContactStore extends ContactState {
  fetchContacts: (limit?: number, offset?: number) => Promise<void>;
  fetchContact: (contactId: string) => Promise<void>;
  createContact: (data: CreateContactParams) => Promise<void>;
  updateContact: (contactId: string, data: UpdateContactParams) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  searchContacts: (query: string) => Promise<void>;
  setSelectedContact: (contact: Contact | null) => void;
  setSearchQuery: (query: string) => void;
  setError: (error: string | null) => void;
  clearContacts: () => void;
  getContactCount: () => Promise<number>;
}

export const useContactStore = create<ContactStore>((set) => ({
  contacts: [],
  selectedContact: null,
  isLoading: false,
  searchQuery: '',
  error: null,

  fetchContacts: async (limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const contacts = await contactQueries.getAllContacts(limit, offset);
      set({ contacts, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch contacts';
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchContact: async (contactId: string) => {
    set({ isLoading: true, error: null });
    try {
      const contact = await contactQueries.getContact(contactId);
      if (contact) {
        set({ selectedContact: contact, isLoading: false });
      } else {
        set({ error: 'Contact not found', isLoading: false });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch contact';
      set({ error: errorMsg, isLoading: false });
    }
  },

  createContact: async (data: CreateContactParams) => {
    set({ isLoading: true, error: null });
    try {
      const contact = await contactQueries.createContact(data);
      set(
        (state) => ({
          contacts: [contact, ...state.contacts],
          isLoading: false,
        }),
        false
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create contact';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateContact: async (contactId: string, data: UpdateContactParams) => {
    set({ isLoading: true, error: null });
    try {
      const updatedContact = await contactQueries.updateContact(contactId, data);
      set(
        (state) => ({
          contacts: state.contacts.map((c) => (c.id === contactId ? updatedContact : c)),
          selectedContact: state.selectedContact?.id === contactId ? updatedContact : state.selectedContact,
          isLoading: false,
        }),
        false
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update contact';
      set({ error: errorMsg, isLoading: false });
    }
  },

  deleteContact: async (contactId: string) => {
    set({ isLoading: true, error: null });
    try {
      await contactQueries.deleteContact(contactId);
      set(
        (state) => ({
          contacts: state.contacts.filter((c) => c.id !== contactId),
          selectedContact: state.selectedContact?.id === contactId ? null : state.selectedContact,
          isLoading: false,
        }),
        false
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete contact';
      set({ error: errorMsg, isLoading: false });
    }
  },

  searchContacts: async (query: string) => {
    set({ isLoading: true, error: null, searchQuery: query });
    try {
      if (query.trim() === '') {
        // Empty query, fetch all
        await contactQueries.getAllContacts();
      } else {
        const contacts = await contactQueries.searchContacts(query);
        set({ contacts, isLoading: false });
        return;
      }
      set({ isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to search contacts';
      set({ error: errorMsg, isLoading: false });
    }
  },

  setSelectedContact: (contact: Contact | null) => set({ selectedContact: contact }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setError: (error: string | null) => set({ error }),

  clearContacts: () =>
    set({
      contacts: [],
      selectedContact: null,
      searchQuery: '',
      error: null,
    }),

  getContactCount: async () => {
    try {
      const count = await contactQueries.getContactCount();
      return count;
    } catch (error) {
      console.error('❌ Failed to get contact count:', error);
      return 0;
    }
  },
}));
