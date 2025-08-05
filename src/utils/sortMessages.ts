import { Message } from "@/types";

export function sortMessages(messages: Message[]) {
  return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
