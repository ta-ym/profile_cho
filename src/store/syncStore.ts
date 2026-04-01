import { create } from 'zustand';
import { SyncState } from '@/types/models';

/**
 * 同期ストア
 * AWS との同期状態を管理
 */
interface SyncStore extends SyncState {
  startSync: () => Promise<void>;
  setSyncProgress: (progress: number) => void;
  setSyncError: (error: string | null) => void;
  resetSync: () => void;
  getLastSyncTime: () => string | null;
  isRecentlySynced: (minutesThreshold?: number) => boolean;
}

export const useSyncStore = create<SyncStore>((set, get) => ({
  status: 'idle',
  lastSyncTime: null,
  errorMessage: null,
  progress: 0,

  startSync: async () => {
    set({
      status: 'syncing',
      errorMessage: null,
      progress: 0,
    });

    try {
      // AWS Amplify sync処理（フェーズ3で実装）
      // 現在はプレースホルダー
      console.log('⚙️ Syncing with AWS...');

      // シミュレーション: 段階的にプログレスを更新
      for (let i = 0; i <= 100; i += 20) {
        set({ progress: i });
        // 実際のAPIコールはここで実行される
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const now = new Date().toISOString();
      set({
        status: 'success',
        lastSyncTime: now,
        progress: 100,
        errorMessage: null,
      });

      // 3秒後にstatusをidleに戻す
      setTimeout(() => {
        set({ status: 'idle' });
      }, 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Sync failed';
      set({
        status: 'error',
        errorMessage: errorMsg,
        progress: 0,
      });
      console.error('❌ Sync error:', errorMsg);
    }
  },

  setSyncProgress: (progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    set({ progress: clamped });
  },

  setSyncError: (error: string | null) => {
    set({
      errorMessage: error,
      status: error ? 'error' : 'idle',
    });
  },

  resetSync: () => {
    set({
      status: 'idle',
      lastSyncTime: null,
      errorMessage: null,
      progress: 0,
    });
  },

  getLastSyncTime: () => {
    return get().lastSyncTime;
  },

  isRecentlySynced: (minutesThreshold = 5) => {
    const { lastSyncTime } = get();
    if (!lastSyncTime) {
      return false;
    }

    const lastSync = new Date(lastSyncTime);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);

    return diffMinutes < minutesThreshold;
  },
}));

/**
 * 同期の詳細情報を取得するヘルパー
 */
export const getSyncStatus = () => {
  const { status, lastSyncTime, errorMessage, progress } = useSyncStore.getState();

  return {
    isSyncing: status === 'syncing',
    hasError: status === 'error',
    isSuccess: status === 'success',
    lastSyncTime,
    errorMessage,
    progress,
    statusText: {
      idle: '同期準備完了',
      syncing: '同期中...',
      error: '同期エラー',
      success: '同期完了',
    }[status],
  };
};

/**
 * 手動同期トリガー
 */
export const triggerSync = async () => {
  const { startSync } = useSyncStore.getState();
  await startSync();
};

/**
 * 自動同期タイマー
 */
export const setupAutoSync = (intervalMinutes: number = 30) => {
  const timer = setInterval(() => {
    const { isRecentlySynced } = useSyncStore.getState();

    // 最近同期しておらず、エラー状態でなければ同期開始
    if (!isRecentlySynced()) {
      console.log('🔄 Auto-sync triggered');
      triggerSync();
    }
  }, intervalMinutes * 60 * 1000);

  return () => clearInterval(timer);
};
