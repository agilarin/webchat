import { create } from "zustand";
import { Unsubscribe } from "firebase/auth";
import { ChatType, Message, UserChat } from "@/types";
import { subscribeToUserChats as _subscribeToUserChats } from "@/services/userChatsService";
import { subscribeToLastMessage as _subscribeToLastMessage } from "@/services/chat/messageService";
import { getChat } from "@/services/chat/chatService";
import { arrayToObjectByKey } from "@/utils/arrayToObjectByKey";
import { createSelectors } from "@/utils/zustand";
import { useReadStatusesStore } from "./readStatusesStore";

interface UserChatsState {
  userChats: Record<string, UserChat>;
  loading: boolean;
  chats: Record<string, ChatType>;
  lastMessages: Record<string, Message | null>;
  reset: () => void;
  subscribeToUserChats: (userId: string) => Unsubscribe;
  subscribeToLastMessage: (chatId: string) => Unsubscribe;
  getLastMessage: (chatId: string) => Message | null;
}

export const useUserChatsStoreBase = create<UserChatsState>((set, get) => ({
  userChats: {},
  loading: true,
  chats: {},
  lastMessages: {},

  reset: () => {
    set({
      userChats: {},
      loading: true,
      chats: {},
      lastMessages: {},
    });
  },

  subscribeToUserChats: (userId) => {
    return _subscribeToUserChats(userId, async (userChats) => {
      const userChatsMap = arrayToObjectByKey(userChats, "chatId");

      const chats = await Promise.all(
        userChats.map(({ chatId }) => getChat(chatId, userId))
      );

      const chatsMap = arrayToObjectByKey(chats, "id");

      set({
        userChats: userChatsMap,
        chats: chatsMap,
        loading: false,
      });
    });
  },

  subscribeToLastMessage: (chatId) => {
    const fetchUnreadCount = useReadStatusesStore.getState().fetchUnreadCount;

    return _subscribeToLastMessage(chatId, async (message) => {
      fetchUnreadCount(chatId);
      set((state) => ({
        lastMessages: {
          ...state.lastMessages,
          [chatId]: message,
        },
      }));
    });
  },

  getLastMessage: (chatId) => {
    return get().lastMessages[chatId] || null;
  },
}));

export const useUserChatsStore = createSelectors(useUserChatsStoreBase);
