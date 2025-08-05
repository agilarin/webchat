import { useActiveChatStore, useCurrentUserStore } from "@/store";
import { UserProfile } from "@/types";
import { getFullName } from "@/utils/getFullName";
import { ChatItem } from "./ChatItem";
import { generatePath } from "react-router";
import { ROUTES } from "@/constants";

interface ChatItemWithUserProps {
  user: UserProfile;
}

export function ChatItemWithUser({ user }: ChatItemWithUserProps) {
  const authUser = useCurrentUserStore.use.authUser();
  const activeChat = useActiveChatStore.use.chat();
  const isActive = activeChat?.peer?.id === user.id;

  if (authUser?.id === user.id) return null;

  return (
    <ChatItem
      active={isActive}
      title={getFullName(user)}
      subtitle={"@" + user.username}
      href={generatePath(ROUTES.CHAT, { username: user.username })}
    />
  );
}
