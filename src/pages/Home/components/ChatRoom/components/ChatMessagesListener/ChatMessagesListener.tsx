import { useEffect } from "react";
import { useThrottledCallback } from "use-debounce";
import { useActiveChatStore, useMessagesStore } from "@/store";
// import { MESSAGE_LIMIT } from "@/constants";
import { useReadStatus } from "@/hooks/store/useReadStatus";
// import { useSortedMessages } from "@/hooks/store/useSortedMessages";
import { useLastMessage } from "@/hooks/store/useLastMessage";
import { useReadStatusLoading } from "@/hooks/store/useLoadingById";

export function ChatMessagesListener() {
  const activeChat = useActiveChatStore.use.chat();

  // const messages = useSortedMessages();
  // const getMessages = useMessagesStore.use.getMessages();
  // const setLoading = useMessagesStore.use.setLoading();
  const initializeMessages = useMessagesStore.use.initializeMessages();
  const loadNewMessages = useMessagesStore.use.loadNewMessages();

  const hasReachedEnd = useMessagesStore.use.hasReachedEnd();
  // const setReachedStart = useMessagesStore.use.setReachedStart();
  // const setReachedEnd = useMessagesStore.use.setReachedEnd();

  const { lastReadAt } = useReadStatus(activeChat?.id);
  const readStatusLoading = useReadStatusLoading(activeChat?.id);
  const lastMessage = useLastMessage(activeChat?.id);

  useEffect(() => {
    if (!activeChat?.id || readStatusLoading) return;

    const load = async () => {
      initializeMessages(lastReadAt);
      // if (lastReadAt) {
      //   const prevMessages = await getMessages({
      //     startAtDate: lastReadAt,
      //     sort: "desc",
      //   });
      //   if (prevMessages.length < MESSAGE_LIMIT) {
      //     setReachedStart(true);
      //   }
      // }
      // const newMessages = await getMessages({
      //   startAfterDate: lastReadAt,
      // });
      // if (newMessages.length < MESSAGE_LIMIT) {
      //   setReachedEnd(true);
      // }
      // setLoading(false);
    };

    const id = setTimeout(() => {
      load();
    }, 300);

    return () => clearTimeout(id);
  }, [activeChat?.id, readStatusLoading]);

  const throttledGetMessages = useThrottledCallback(async () => {
    // await getMessages({ startAfterDate: date });
    await loadNewMessages();
  }, 500);

  useEffect(() => {
    // const createdAt = messages[messages.length - 1]?.createdAt;
    // if (!createdAt || !hasReachedEnd) return;

    // throttledGetMessages(createdAt);
    throttledGetMessages();
  }, [throttledGetMessages, hasReachedEnd, lastMessage]);

  useEffect(() => {
    return () => throttledGetMessages.cancel();
  }, [throttledGetMessages]);

  return null;
}
