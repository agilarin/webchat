import { useLayoutEffect, useRef } from "react";
import { generatePath, useLocation, useParams } from "react-router";
import { useActiveChatStore, useMessagesStore } from "@/store";
import { ROUTES } from "@/constants";

export function useResetChatOnRouteChange() {
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const resetActiveChat = useActiveChatStore.use.reset();
  const resetMessages = useMessagesStore.use.reset();

  const prevUsername = useRef<string | undefined>(undefined);

  useLayoutEffect(() => {
    const isOnChatPage = location.pathname.startsWith(
      generatePath(ROUTES.CHAT, { username: "" })
    );

    const usernameChanged = prevUsername.current !== username;

    if (!isOnChatPage || usernameChanged) {
      resetActiveChat();
      resetMessages();
    }
  }, [location.pathname, username]);
}
