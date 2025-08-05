import { create } from "zustand";
import { Message } from "@/types";
import {
  sendMessage as _sendMessage,
  getMessages as _getMessages,
} from "@/services/chat/messageService";
import { arrayToObjectByKey } from "@/utils/arrayToObjectByKey";
import { createSelectors, getActiveChatOrThrow } from "@/utils/zustand";
import { useCurrentUserStore } from "./currentUserStore";
import { MAX_INDEX, MESSAGE_LIMIT, STORE_ERRORS } from "@/constants";
import { sortMessages } from "@/utils/sortMessages";
import { useActiveChatStore } from "./activeChatStore";

interface MessagesState {
  messages: Record<string, Message>;
  loading: boolean;
  hasReachedStart: boolean;
  hasReachedEnd: boolean;
  firstItemIndex: number;
  loadingPrev: boolean;
  loadingNext: boolean;

  reset: () => void;
  sendMessage: (text: string) => Promise<void>;
  initializeMessages: (date?: Date | null) => Promise<void>;
  loadNewMessages: () => Promise<void>;
  loadPrevMessages: () => Promise<void>;
  loadNextMessages: () => Promise<void>;
}

export const useMessagesStoreBase = create<MessagesState>((set, get) => ({
  messages: {},
  loading: true,
  hasReachedStart: false,
  hasReachedEnd: false,
  loadingPrev: false,
  loadingNext: false,
  firstItemIndex: MAX_INDEX,

  reset: () =>
    set({
      loading: true,
      messages: {},
      hasReachedStart: false,
      hasReachedEnd: false,
      loadingPrev: false,
      loadingNext: false,
      firstItemIndex: MAX_INDEX,
    }),

  sendMessage: async (message) => {
    const authUser = useCurrentUserStore.getState().authUser;
    if (!authUser) throw Error(STORE_ERRORS.NO_USER);
    const activeChat = getActiveChatOrThrow();
    if (activeChat.isDraft) {
      await useActiveChatStore.getState().saveChat();
    }

    const newMessageId = await _sendMessage({
      chatId: activeChat.id,
      senderId: authUser.id,
      members: activeChat.members,
      message,
    });

    set((state) => ({
      messages: {
        ...state.messages,
        [newMessageId]: {
          id: newMessageId,
          senderId: authUser.id,
          text: message,
          createdAt: new Date(Date.now()),
        },
      },
    }));
  },

  initializeMessages: async (date) => {
    const activeChat = getActiveChatOrThrow();
    if (activeChat.isDraft) {
      set({ loading: false });
      return;
    }

    set({ loading: true });

    let prevMessages: Message[] = [];
    if (date) {
      prevMessages = await _getMessages({
        chatId: activeChat.id,
        startAtDate: date,
        sort: "desc",
      });
    }
    const newMessages = await _getMessages({
      chatId: activeChat.id,
      startAfterDate: date,
    });

    if (activeChat.id === useActiveChatStore.getState().chat?.id) {
      set({
        messages: {
          ...arrayToObjectByKey(prevMessages, "id"),
          ...arrayToObjectByKey(newMessages, "id"),
        },
        loading: false,
        hasReachedStart: prevMessages.length < MESSAGE_LIMIT,
        hasReachedEnd: newMessages.length < MESSAGE_LIMIT,
      });
    }
  },

  loadNewMessages: async () => {
    const activeChat = getActiveChatOrThrow();
    const { messages, loading, hasReachedEnd } = get();
    const sortedMessages = sortMessages(Object.values(messages));
    if (loading || !hasReachedEnd || activeChat.isDraft) return;

    const newMessages = await _getMessages({
      chatId: activeChat.id,
      startAfterDate: sortedMessages[sortedMessages.length - 1]?.createdAt,
    });

    if (activeChat.id === useActiveChatStore.getState().chat?.id) {
      set((state) => ({
        messages: {
          ...state.messages,
          ...arrayToObjectByKey(newMessages, "id"),
        },
      }));
    }
  },

  loadPrevMessages: async () => {
    const activeChat = getActiveChatOrThrow();
    const { messages, loadingPrev, hasReachedStart } = get();
    const sortedMessages = sortMessages(Object.values(messages));
    if (
      !sortedMessages.length ||
      loadingPrev ||
      hasReachedStart ||
      activeChat.isDraft
    ) {
      return;
    }
    set({ loadingPrev: true });

    const prevMessages = await _getMessages({
      chatId: activeChat.id,
      startAfterDate: sortedMessages[0].createdAt,
      sort: "desc",
    });

    if (activeChat.id === useActiveChatStore.getState().chat?.id) {
      set((state) => ({
        messages: {
          ...state.messages,
          ...arrayToObjectByKey(prevMessages, "id"),
        },
        firstItemIndex: state.firstItemIndex - prevMessages.length,
        loadingPrev: false,
        hasReachedStart: prevMessages.length < MESSAGE_LIMIT,
      }));
    }
  },

  loadNextMessages: async () => {
    const activeChat = getActiveChatOrThrow();
    const { messages, loadingNext, hasReachedEnd } = get();
    const sortedMessages = sortMessages(Object.values(messages));
    if (
      !sortedMessages.length ||
      loadingNext ||
      hasReachedEnd ||
      activeChat.isDraft
    ) {
      return;
    }
    set({ loadingNext: true });

    const NextMessages = await _getMessages({
      chatId: activeChat.id,
      startAfterDate: sortedMessages[sortedMessages.length - 1].createdAt,
    });

    if (activeChat.id === useActiveChatStore.getState().chat?.id) {
      set((state) => ({
        messages: {
          ...state.messages,
          ...arrayToObjectByKey(NextMessages, "id"),
        },
        loadingNext: false,
        hasReachedEnd: NextMessages.length < MESSAGE_LIMIT,
      }));
    }
  },
}));

export const useMessagesStore = createSelectors(useMessagesStoreBase);
