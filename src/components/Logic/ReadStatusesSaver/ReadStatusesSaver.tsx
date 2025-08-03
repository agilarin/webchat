import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import { useReadStatusesStore } from "@/store";

type DebounceMap = Record<string, ReturnType<typeof debounce>>;

export function ReadStatusesSaver() {
  const readStatuses = useReadStatusesStore.use.readStatuses();
  const readStatusesLoading = useReadStatusesStore.use.readStatusesLoading();
  const lastReadMessages = useReadStatusesStore.use.lastReadMessages();
  const saveReadStatus = useReadStatusesStore.use.saveReadStatus();

  const prevLastReadRef = useRef<typeof lastReadMessages>({});
  const debouncersRef = useRef<DebounceMap>({});

  useEffect(() => {
    Object.entries(lastReadMessages).forEach(([chatId, message]) => {
      const readStatus = readStatuses[chatId];
      const readStatusLoading = readStatusesLoading[chatId];
      const prevMessage = prevLastReadRef.current[chatId];

      if (
        readStatusLoading ||
        !message ||
        readStatus?.lastReadMessageId === message.id ||
        prevMessage?.id === message.id ||
        (readStatus?.lastReadAt &&
          readStatus?.lastReadAt.getTime() > message.createdAt.getTime()) ||
        (prevMessage &&
          prevMessage.createdAt.getTime() > message.createdAt.getTime())
      ) {
        return;
      }

      if (!debouncersRef.current[chatId]) {
        debouncersRef.current[chatId] = debounce(
          async (chatId, message) => {
            await saveReadStatus(chatId, message);
          },
          2000,
          { leading: false, trailing: true }
        );
      }

      debouncersRef.current[chatId](chatId, message);

      prevLastReadRef.current[chatId] = message;
    });
  }, [lastReadMessages, readStatuses, readStatusesLoading]);

  useEffect(() => {
    return () => {
      Object.values(debouncersRef.current).forEach((fn) => fn.cancel());
      debouncersRef.current = {};
    };
  }, []);

  return null;
}
