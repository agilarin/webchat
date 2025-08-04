import { ChatType } from "@/types";
import { ChatItemWithChat, ChatList } from "@/pages/Home/components/ChatList";

interface ExistingChatsListProps {
  chats: ChatType[];
}

export function ExistingChatsList({ chats }: ExistingChatsListProps) {
  if (!chats.length) return null;

  return (
    <div>
      <ChatList>
        {chats.map((chat) => (
          <ChatItemWithChat
            key={chat.id}
            chatId={chat.id}
          />
        ))}
      </ChatList>
    </div>
  );
}
