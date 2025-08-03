import { RawMessage } from "@/types";

export function sortMessages(messages: RawMessage[]) {
  return messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}
