import { useEffect } from "react";
import { useCurrentUserStore, useUserChatsStore } from "@/store";

export function UserChatsListener() {
  const authUser = useCurrentUserStore.use.authUser();
  const subscribeToUserChats = useUserChatsStore.use.subscribeToUserChats();

  useEffect(() => {
    if (!authUser?.id) return;

    const unsub = subscribeToUserChats(authUser?.id);

    return () => unsub();
  }, [authUser?.id, subscribeToUserChats]);

  return null;
}
