import { STORE_ERRORS } from "@/constants";
import { useActiveChatStore } from "@/store";

export function getActiveChatOrThrow() {
  const activeChat = useActiveChatStore.getState().chat;
  if (!activeChat) throw Error(STORE_ERRORS.NO_ACTIVE_CHAT);
  return activeChat;
}
