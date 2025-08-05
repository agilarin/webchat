import { create } from "zustand";
import { Unsubscribe } from "firebase/auth";
import { Message, ReadStatus } from "@/types";
import {
  subscribeToReadStatus as _subscribeToReadStatus,
  updateReadStatus,
} from "@/services/chat/readStatusService";
import { getMessagesCount } from "@/services/chat/messageService";
import { createSelectors } from "@/utils/zustand";
import { useCurrentUserStore } from "./currentUserStore";

interface ReadStatusesState {
  readStatuses: Record<string, ReadStatus | undefined>;
  readStatusesLoading: Record<string, boolean | undefined>;
  readStatusesUpdating: Record<string, boolean | undefined>;
  lastReadMessages: Record<string, Message | null | undefined>;

  unreadCounts: Record<string, number | undefined>;
  readCounts: Record<string, number | undefined>;

  reset: () => void;

  subscribeToReadStatus: (chatId: string, userId: string) => Unsubscribe;
  saveReadStatus: (chatId: string, data: Message) => Promise<void>;

  markRead: (chatId: string, message: Message) => void;
  updateReadCount: (chatId: string, value: number) => void;
  fetchUnreadCount: (chatId: string, date?: Date | null) => Promise<void>;
}

export const useReadStatusesStoreBase = create<ReadStatusesState>(
  (set, get) => ({
    readStatuses: {},
    readStatusesLoading: {},
    readStatusesUpdating: {},
    unreadCounts: {},
    readCounts: {},
    lastReadMessages: {},

    reset: () => {
      set({
        readStatuses: {},
        readStatusesLoading: {},
        readStatusesUpdating: {},
        unreadCounts: {},
        readCounts: {},
        lastReadMessages: {},
      });
    },

    subscribeToReadStatus: (chatId, userId) => {
      set((state) => ({
        readStatusesLoading: {
          ...state.readStatusesLoading,
          [chatId]: true,
        },
      }));

      const fetchUnreadCount = get().fetchUnreadCount;

      return _subscribeToReadStatus({ chatId, userId }, (readStatus) => {
        if (!readStatus) return;
        fetchUnreadCount(chatId, readStatus.lastReadAt);

        set((state) => ({
          readStatuses: {
            ...state.readStatuses,
            [chatId]: readStatus,
          },
          readStatusesLoading: {
            ...state.readStatusesLoading,
            [chatId]: false,
          },
        }));
      });
    },

    saveReadStatus: async (chatId, message) => {
      const oldReadCount = get().readCounts[chatId] || 0;
      const fetchUnreadCount = get().fetchUnreadCount;
      const authUser = useCurrentUserStore.getState().authUser;
      if (!authUser?.id) return;

      try {
        set((state) => ({
          readStatusesUpdating: {
            ...state.readStatusesUpdating,
            [chatId]: true,
          },
        }));

        await updateReadStatus({
          chatId,
          userId: authUser.id,
          messageCreatedAt: message.createdAt,
          messageId: message.id,
        });

        await fetchUnreadCount(chatId, message.createdAt);

        const readCount = get().readCounts[chatId] || 0;

        set((state) => ({
          readCounts: {
            ...state.readCounts,
            [chatId]: Math.max(readCount - oldReadCount, 0),
          },
        }));
      } finally {
        set((state) => ({
          readStatusesUpdating: {
            ...state.readStatusesUpdating,
            [chatId]: false,
          },
        }));
      }
    },

    updateReadCount: (chatId, value) => {
      set((state) => ({
        readCounts: {
          ...state.readCounts,
          [chatId]: value,
        },
      }));
    },

    fetchUnreadCount: async (chatId, date) => {
      const storeDate = get().readStatuses[chatId]?.lastReadAt;

      const count = await getMessagesCount(chatId, date || storeDate);

      set((state) => ({
        unreadCounts: {
          ...state.unreadCounts,
          [chatId]: count,
        },
      }));
    },

    markRead: (chatId, message) => {
      const createdAtBDLoading = get().readStatusesLoading[chatId];
      if (createdAtBDLoading) throw new Error("");

      const createdAtBD = get().readStatuses[chatId]?.lastReadAt;
      const createdAtLocal = get().lastReadMessages[chatId]?.createdAt;
      const createdAtNewTime = message.createdAt.getTime();

      if (createdAtLocal && createdAtLocal.getTime() >= createdAtNewTime) {
        return;
      }
      if (createdAtBD && createdAtBD.getTime() >= createdAtNewTime) {
        return;
      }

      set((state) => ({
        lastReadMessages: {
          ...state.lastReadMessages,
          [chatId]: message,
        },
        readCounts: {
          ...state.readCounts,
          [chatId]: (state.readCounts[chatId] || 0) + 1,
        },
      }));
    },
  })
);

export const useReadStatusesStore = createSelectors(useReadStatusesStoreBase);
