import { useActiveChatStore } from "@/store";
import { useUnreadCount } from "@/hooks/store/useUnreadCount";
import { ChatItem } from "./ChatItem";
import { useChat } from "@/hooks/store/useChat";
import { useLastMessage } from "@/hooks/store/useLastMessage";

interface ChatItemWithChatProps {
  chatId: string;
}

export function ChatItemWithChat({ chatId }: ChatItemWithChatProps) {
  const activeChat = useActiveChatStore.use.chat();
  const setChat = useActiveChatStore.use.setChat();
  const chat = useChat(chatId);
  const lastMessage = useLastMessage(chatId);
  const unreadCount = useUnreadCount(chatId);

  const handleClick = () => {
    if (activeChat?.id !== chat.id) {
      setChat(chat);
    }
  };

  return (
    <ChatItem
      active={activeChat?.id === chatId}
      title={chat.title}
      subtitle={lastMessage?.text}
      date={lastMessage?.createdAt}
      count={unreadCount}
      onClick={handleClick}
    />
  );
}
