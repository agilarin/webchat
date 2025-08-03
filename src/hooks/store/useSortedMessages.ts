import { useMessagesStore } from "@/store";
import { sortMessages } from "@/utils/sortMessages";

export function useSortedMessages() {
  const messages = Object.values(useMessagesStore.use.messages());
  return sortMessages(messages);
}
