import { useActiveChatStore, useCurrentUserStore } from "@/store";
import { UserType } from "@/types";
import { getFullName } from "@/utils/getFullName";
import { ChatItem } from "./ChatItem";

interface ChatItemWithUserProps {
  user: UserType;
}

export function ChatItemWithUser({ user }: ChatItemWithUserProps) {
  const authUser = useCurrentUserStore.use.authUser();
  const activeChat = useActiveChatStore.use.chat();
  const createPrivateChat = useActiveChatStore.use.createPrivateChat();
  const isActive = activeChat?.peer?.id === user.id;

  const handleClick = () => {
    if (!isActive) {
      createPrivateChat(user);
    }
  };

  if (authUser?.id === user.id) return null;

  return (
    <ChatItem
      active={isActive}
      title={getFullName(user)}
      subtitle={"@" + user.username}
      onClick={handleClick}
    />
  );
}
