import { useReadStatusesStore } from "@/store";

export function useUnreadCount(chatId?: string) {
  return useReadStatusesStore((state) => {
    if (!chatId) return 0;
    const raw = state.unreadCounts[chatId] ?? 0;
    const read = state.readCounts[chatId] ?? 0;
    return Math.max(raw - read, 0);
  });
}
