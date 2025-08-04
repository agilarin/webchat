import { create } from "zustand";
import { ChatType, UserProfile } from "@/types";
import { STORE_ERRORS } from "@/constants";
import { createChat as _createChat } from "@/services/chat/chatService";
import { generateUniqueId } from "@/utils/generateUniqueId";
import { createSelectors } from "@/utils/zustand";
import { useCurrentUserStore } from "./currentUserStore";
import { useMessagesStore } from "./messagesStore";
import { getFullName } from "@/utils/getFullName";

interface ActiveChatState {
  chat: ChatType | null;
  setChat: (chat: ChatType | null) => void;
  createPrivateChat: (peer: UserProfile) => void;
  saveChat: () => void;
  reset: () => void;
}

export const useActiveChatStoreBase = create<ActiveChatState>((set, get) => ({
  chat: null,

  setChat: (chat) => {
    set({ chat });
    useMessagesStore.getState().reset();
  },

  createPrivateChat: (peer) => {
    const authUser = useCurrentUserStore.getState().authUser;
    if (!authUser) throw new Error(STORE_ERRORS.NO_USER);

    set({
      chat: {
        id: generateUniqueId(),
        type: "PRIVATE",
        members: [authUser.id, peer.id],
        title: getFullName(peer),
        username: peer.username,
        peer: peer,
      },
    });
  },

  saveChat: async () => {
    const authUser = useCurrentUserStore.getState().authUser;
    if (!authUser) throw new Error(STORE_ERRORS.NO_USER);

    const chat = get().chat;
    if (!chat) throw new Error(STORE_ERRORS.NO_ACTIVE_CHAT);

    const createdChat = await _createChat(authUser.id, chat);
    set({ chat: createdChat });
  },

  reset: () => {
    set({
      chat: null,
    });
  },
}));

export const useActiveChatStore = createSelectors(useActiveChatStoreBase);
