import { useUserChatsStore } from "@/store";

export function useChatByUsername(username?: string) {
  return useUserChatsStore((state) => {
    return (
      Object.values(state.chats).find((chat) => chat.username === username) ||
      null
    );
  });
}
