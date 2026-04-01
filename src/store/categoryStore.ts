import { create } from 'zustand';
import { Category, CategoryState, CreateCategoryParams, UpdateCategoryParams } from '@/types/models';
import * as categoryQueries from '@/services/database/queries/categoryQueries';

/**
 * カテゴリストア
 * プロフィール分類管理
 */
interface CategoryStore extends CategoryState {
  fetchCategories: () => Promise<void>;
  fetchCategory: (categoryId: string) => Promise<void>;
  createCategory: (data: CreateCategoryParams) => Promise<void>;
  updateCategory: (categoryId: string, data: UpdateCategoryParams) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
  setError: (error: string | null) => void;
  clearCategories: () => void;
  assignCategoryToContact: (contactId: string, categoryId: string) => Promise<void>;
  unassignCategoryFromContact: (contactId: string, categoryId: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryQueries.getAllCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ error: errorMsg, isLoading: false });
    }
  },

  fetchCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoryQueries.getCategory(categoryId);
      if (category) {
        set({ selectedCategory: category, isLoading: false });
      } else {
        set({ error: 'Category not found', isLoading: false });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch category';
      set({ error: errorMsg, isLoading: false });
    }
  },

  createCategory: async (data: CreateCategoryParams) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoryQueries.createCategory(data);
      set(
        (state) => ({
          categories: [...state.categories, category],
          isLoading: false,
        }),
        false
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create category';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateCategory: async (categoryId: string, data: UpdateCategoryParams) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryQueries.updateCategory(categoryId, data);
      set(
        (state) => ({
          categories: state.categories.map((c) => (c.id === categoryId ? updatedCategory : c)),
          selectedCategory: state.selectedCategory?.id === categoryId ? updatedCategory : state.selectedCategory,
          isLoading: false,
        }),
        false
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update category';
      set({ error: errorMsg, isLoading: false });
    }
  },

  deleteCategory: async (categoryId: string) => {
    set({ isLoading: true, error: null });
    try {
      await categoryQueries.deleteCategory(categoryId);
      set(
        (state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
          selectedCategory: state.selectedCategory?.id === categoryId ? null : state.selectedCategory,
          isLoading: false,
        }),
        false
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete category';
      set({ error: errorMsg, isLoading: false });
    }
  },

  setSelectedCategory: (category: Category | null) => set({ selectedCategory: category }),

  setError: (error: string | null) => set({ error }),

  clearCategories: () =>
    set({
      categories: [],
      selectedCategory: null,
      error: null,
    }),

  assignCategoryToContact: async (contactId: string, categoryId: string) => {
    try {
      await categoryQueries.assignCategory(contactId, categoryId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to assign category';
      set({ error: errorMsg });
    }
  },

  unassignCategoryFromContact: async (contactId: string, categoryId: string) => {
    try {
      await categoryQueries.unassignCategory(contactId, categoryId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to unassign category';
      set({ error: errorMsg });
    }
  },
}));
