import { useEffect, useRef } from "react";
import { Unsubscribe } from "firebase/auth";
import { useCurrentUserStore, useUserChatsStore } from "@/store";

export function LastMessagesListener() {
  const authUser = useCurrentUserStore.use.authUser();
  const subscribeToLastMessage = useUserChatsStore.use.subscribeToLastMessage();
  const userChats = useUserChatsStore.use.userChats();
  const unsubsRef = useRef<Record<string, Unsubscribe>>({});

  useEffect(() => {
    if (!authUser?.id) return;

    const chatIds = Object.keys(userChats);
    const prevChatIds = Object.keys(unsubsRef.current);

    for (const prevId of prevChatIds) {
      if (!chatIds.includes(prevId)) {
        unsubsRef.current[prevId]?.();
        delete unsubsRef.current[prevId];
      }
    }

    for (const chatId of chatIds) {
      if (!unsubsRef.current[chatId]) {
        unsubsRef.current[chatId] = subscribeToLastMessage(chatId);
      }
    }
  }, [authUser?.id, userChats, subscribeToLastMessage]);

  useEffect(() => {
    return () => {
      Object.values(unsubsRef.current).forEach((unsub) => unsub());
      unsubsRef.current = {};
    };
  }, []);

  return null;
}
