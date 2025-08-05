import { useEffect, useRef } from "react";
import {
  useCurrentUserStore,
  useReadStatusesStore,
  useUserChatsStore,
} from "@/store";
import { Unsubscribe } from "firebase/auth";

export function ReadStatusesListener() {
  const authUser = useCurrentUserStore.use.authUser();
  const userChats = useUserChatsStore.use.userChats();
  const subscribeToReadStatus =
    useReadStatusesStore.use.subscribeToReadStatus();
  const unsubsRef = useRef<Record<string, Unsubscribe>>({});

  useEffect(() => {
    if (!authUser?.id) return;

    const chatIds = Object.values(userChats).map(({ chatId }) => chatId);
    const prevChatIds = Object.keys(unsubsRef.current);

    for (const prevId of prevChatIds) {
      if (!chatIds.includes(prevId)) {
        unsubsRef.current[prevId]?.();
        delete unsubsRef.current[prevId];
      }
    }

    for (const chatId of chatIds) {
      if (!unsubsRef.current[chatId]) {
        unsubsRef.current[chatId] = subscribeToReadStatus(chatId, authUser.id);
      }
    }
  }, [authUser?.id, userChats, subscribeToReadStatus]);

  useEffect(() => {
    return () => {
      Object.values(unsubsRef.current).forEach((unsub) => unsub());
      unsubsRef.current = {};
    };
  }, []);

  return null;
}
