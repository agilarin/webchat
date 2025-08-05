import { useEffect } from "react";
import { useNavigate } from "react-router";

import { ROUTES } from "@/constants";
import { getUsername } from "@/services/usernameService";
import { getUserProfile } from "@/services/userService";
import { useChatByUsername } from "@/hooks/store/useChatByUsername";
import { useActiveChatStore, useUserChatsStore } from "@/store";

export function useResolveChatByUsername(username: string) {
  const navigate = useNavigate();

  const chat = useChatByUsername(username);
  const loading = useUserChatsStore.use.loading();

  const activeChat = useActiveChatStore.use.chat();
  const setChat = useActiveChatStore.use.setChat();
  const createPrivateChat = useActiveChatStore.use.createPrivateChat();

  useEffect(() => {
    if (loading) return;

    if (chat) {
      setChat(chat);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        const usernameObj = await getUsername(username);
        if (!isMounted || !usernameObj?.userId) {
          navigate(ROUTES.ROOT);
          return;
        }

        const peer = await getUserProfile(usernameObj.userId);
        if (!isMounted || !peer) {
          navigate(ROUTES.ROOT);
          return;
        }

        await createPrivateChat(peer);
      } catch (e) {
        console.error(e);
        if (isMounted) navigate(ROUTES.ROOT);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [username, chat, loading]);

  return {
    activeChat,
    loading,
  };
}
