import { useEffect, useRef } from "react";
import throttle from "lodash.throttle";
import { useReadStatusesStore, useUserChatsStore } from "@/store";

type ThrottleMap = Record<string, ReturnType<typeof throttle>>;

export function UnreadCountListener() {
  const readStatuses = useReadStatusesStore.use.readStatuses();
  const fetchUnreadCount = useReadStatusesStore.use.fetchUnreadCount();
  const readStatusesUpdating = useReadStatusesStore.use.readStatusesUpdating();

  const lastMessages = useUserChatsStore.use.lastMessages();

  const prevLastMessagesRef = useRef<typeof lastMessages>({});
  const throttlersRef = useRef<ThrottleMap>({});

  useEffect(() => {
    Object.entries(readStatuses).forEach(([chatId, readStatus]) => {
      const prevLastMessage = prevLastMessagesRef.current[chatId];
      const lastMessage = lastMessages[chatId];
      const readStatusUpdating = readStatusesUpdating[chatId];

      if (
        readStatusUpdating ||
        !readStatus ||
        !lastMessage ||
        prevLastMessage?.id === lastMessage.id
      ) {
        return;
      }

      if (!throttlersRef.current[chatId]) {
        throttlersRef.current[chatId] = throttle(
          async (chatId: string, date: Date) => {
            await fetchUnreadCount(chatId, date);
          },
          1000,
          { leading: true, trailing: true }
        );
      }

      throttlersRef.current[chatId](chatId, readStatus.lastReadAt);

      prevLastMessagesRef.current[chatId] = lastMessage;
    });
  }, [readStatuses, readStatusesUpdating, lastMessages]);

  useEffect(() => {
    return () => {
      Object.values(throttlersRef.current).forEach((fn) => fn.cancel());
      throttlersRef.current = {};
    };
  }, []);

  return null;
}
