import { ChatList, ChatItemWithChat, ChatListSkeleton } from "../ChatList";
import { useUserChatsStore } from "@/store";

export function UserChatsList() {
  const chats = useUserChatsStore.use.chats();
  const loading = useUserChatsStore.use.loading();

  if (loading) return <ChatListSkeleton />;

  return (
    <ChatList>
      {Object.values(chats).map((item) => (
        <ChatItemWithChat
          key={item.id}
          chatId={item.id}
        />
      ))}
    </ChatList>
  );
}
