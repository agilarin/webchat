import { useUserChatsStore } from "@/store";

export function useChat(chatId: string) {
  return useUserChatsStore((state) => state.chats[chatId]);
}
