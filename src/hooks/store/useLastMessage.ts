import { useUserChatsStore } from "@/store";

export function useLastMessage(chatId?: string) {
  return useUserChatsStore((state) => {
    if (!chatId) return null;
    return state.lastMessages[chatId] ?? null;
  });
}
