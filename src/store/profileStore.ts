import { create } from 'zustand';
import { User, ProfileState, CreateUserParams, UpdateUserParams } from '@/types/models';
import * as profileQueries from '@/services/database/queries/profileQueries';

/**
 * プロフィールストア
 * 自身のプロフィール管理
 */
interface ProfileStore extends ProfileState {
  fetchProfile: (userId: string) => Promise<void>;
  createProfile: (data: CreateUserParams) => Promise<void>;
  updateProfile: (userId: string, data: UpdateUserParams) => Promise<void>;
  deleteProfile: (userId: string) => Promise<void>;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileQueries.getProfile(userId);
      set({ profile, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: errorMsg, isLoading: false });
    }
  },

  createProfile: async (data: CreateUserParams) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileQueries.createProfile(data);
      set({ profile, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create profile';
      set({ error: errorMsg, isLoading: false });
    }
  },

  updateProfile: async (userId: string, data: UpdateUserParams) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await profileQueries.updateProfile(userId, data);
      set({ profile, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: errorMsg, isLoading: false });
    }
  },

  deleteProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await profileQueries.deleteProfile(userId);
      set({ profile: null, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete profile';
      set({ error: errorMsg, isLoading: false });
    }
  },

  setError: (error: string | null) => set({ error }),

  clearProfile: () => set({ profile: null, error: null }),
}));
