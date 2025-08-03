import { useReadStatusesStore } from "@/store";

export function useReadStatus(chatId?: string) {
  const lastReadMessageId = useReadStatusesStore((state) => {
    if (!chatId) return null;
    return state.readStatuses[chatId]?.lastReadMessageId ?? null;
  });
  const lastReadAt = useReadStatusesStore((state) => {
    if (!chatId) return null;
    return state.readStatuses[chatId]?.lastReadAt ?? null;
  });
  return {
    lastReadMessageId,
    lastReadAt,
  };
}
