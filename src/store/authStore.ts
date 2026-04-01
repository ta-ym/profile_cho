import { create } from 'zustand';
import { AuthState } from '@/types/models';

/**
 * 認証ストア
 * ローカル認証状態を管理
 */
interface AuthStore extends AuthState {
  setPasswordHash: (hash: string) => void;
  logout: () => void;
  isPasswordSet: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  passwordHash: null,

  setPasswordHash: (hash: string) =>
    set({
      passwordHash: hash,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      passwordHash: null,
    }),

  isPasswordSet: () => {
    const { passwordHash } = get();
    return Boolean(passwordHash);
  },
}));
