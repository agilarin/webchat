import { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";
import { useActiveChatStore, useMessagesStore } from "@/store";
import { useReadStatus } from "@/hooks/store/useReadStatus";
import { useLastMessage } from "@/hooks/store/useLastMessage";
import { useReadStatusLoading } from "@/hooks/store/useLoadingById";

export function ChatMessagesListener() {
  const activeChat = useActiveChatStore.use.chat();

  const initializeMessages = useMessagesStore.use.initializeMessages();
  const loadNewMessages = useMessagesStore.use.loadNewMessages();
  const hasReachedEnd = useMessagesStore.use.hasReachedEnd();

  const { lastReadAt } = useReadStatus(activeChat?.id);
  const readStatusLoading = useReadStatusLoading(activeChat?.id);
  const lastMessage = useLastMessage(activeChat?.id);

  useEffect(() => {
    if (!activeChat?.id || readStatusLoading) return;

    initializeMessages(lastReadAt);
  }, [activeChat?.id, readStatusLoading]);

  const throttledGetMessages = useThrottledCallback(async () => {
    await loadNewMessages();
  }, 500);

  useEffect(() => {
    throttledGetMessages();
  }, [throttledGetMessages, hasReachedEnd, lastMessage]);

  useEffect(() => {
    return () => throttledGetMessages.cancel();
  }, [throttledGetMessages]);

  return null;
}
