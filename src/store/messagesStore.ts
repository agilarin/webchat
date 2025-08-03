import { create } from "zustand";
import { RawMessage } from "@/types";
import {
  subscribeToMessages as _subscribeToMessages,
  sendMessage as _sendMessage,
  getMessages as _getMessages,
  GetMessagesParams,
} from "@/services/chat/messageService";
import { arrayToObjectByKey } from "@/utils/arrayToObjectByKey";
import { createSelectors, getActiveChatOrThrow } from "@/utils/zustand";
import { useCurrentUserStore } from "./currentUserStore";
import { MAX_INDEX, MESSAGE_LIMIT, STORE_ERRORS } from "@/constants";
import { sortMessages } from "@/utils/sortMessages";
import { useActiveChatStore } from "./activeChatStore";

interface GetMessagesStoreProps extends Omit<GetMessagesParams, "chatId"> {
  onBeforeSet?: (message: RawMessage[]) => void;
}

interface MessagesState {
  messages: Record<string, RawMessage>;
  loading: boolean;
  hasReachedStart: boolean;
  hasReachedEnd: boolean;
  firstItemIndex: number;
  loadingPrev: boolean;
  loadingNext: boolean;

  setLoading: (value: boolean) => void;
  setReachedStart: (value: boolean) => void;
  setReachedEnd: (value: boolean) => void;
  reset: () => void;
  sendMessage: (text: string) => Promise<void>;
  getMessages: (params: GetMessagesStoreProps) => Promise<RawMessage[]>;
  setMessages: (messages: RawMessage[]) => void;
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

  setLoading: (value) => set({ loading: value }),
  setReachedStart: (value) => set({ hasReachedStart: value }),
  setReachedEnd: (value) => set({ hasReachedEnd: value }),
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

  getMessages: async (params) => {
    const activeChat = getActiveChatOrThrow();

    const messages = await _getMessages({
      chatId: activeChat.id,
      ...params,
    });
    const messageMap = arrayToObjectByKey(messages, "id");

    if (params.onBeforeSet) {
      params.onBeforeSet(messages);
      await new Promise((r) => setTimeout(() => r(1), 10));
    }

    if (activeChat.id === getActiveChatOrThrow().id) {
      set((state) => ({
        messages: {
          ...state.messages,
          ...messageMap,
        },
      }));
    }

    return messages;
  },

  setMessages: (messages) => {
    const messageMap = arrayToObjectByKey(messages, "id");
    set((state) => ({
      messages: {
        ...state.messages,
        ...messageMap,
      },
    }));
  },

  initializeMessages: async (date) => {
    const activeChat = getActiveChatOrThrow();
    set({ loading: true });

    let prevMessages: RawMessage[] = [];
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
    if (loading || !hasReachedEnd) return;

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
    if (!sortedMessages.length || loadingPrev || hasReachedStart) return;
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
    if (!sortedMessages.length || loadingNext || hasReachedEnd) return;
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
