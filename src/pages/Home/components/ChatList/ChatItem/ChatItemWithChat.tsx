import { generatePath } from "react-router";
import { useActiveChatStore } from "@/store";
import { ROUTES } from "@/constants";
import { useUnreadCount } from "@/hooks/store/useUnreadCount";
import { useChat } from "@/hooks/store/useChat";
import { useLastMessage } from "@/hooks/store/useLastMessage";
import { ChatItem } from "./ChatItem";

interface ChatItemWithChatProps {
  chatId: string;
}

export function ChatItemWithChat({ chatId }: ChatItemWithChatProps) {
  const activeChat = useActiveChatStore.use.chat();
  const chat = useChat(chatId);
  const lastMessage = useLastMessage(chatId);
  const unreadCount = useUnreadCount(chatId);

  return (
    <ChatItem
      active={activeChat?.id === chatId}
      title={chat.title}
      subtitle={lastMessage?.text}
      date={lastMessage?.createdAt}
      count={unreadCount}
      href={generatePath(ROUTES.CHAT, { username: chat.username })}
    />
  );
}
