import { Search } from "@/pages/Home/components/Search";
import { UserAccount } from "@/pages/Home/components/UserAccount";
import { ChatList, ChatItemWithChat, ChatListSkeleton } from "../ChatList";
import { useUserChatsStore } from "@/store";
import classes from "./Sidebar.module.scss";

export function Sidebar() {
  const chats = useUserChatsStore.use.chats();
  const loading = useUserChatsStore.use.loading();

  if (loading) {
    return (
      <div className={classes.sidebarRoot}>
        <div className={classes.userContainer}>
          <UserAccount />
        </div>
        <div className={classes.content}>
          <Search />
          <ChatListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={classes.sidebarRoot}>
      <div className={classes.userContainer}>
        <UserAccount />
      </div>
      <div className={classes.content}>
        <Search />
        <ChatList>
          {Object.values(chats).map((item) => (
            <ChatItemWithChat
              key={item.id}
              chatId={item.id}
            />
          ))}
        </ChatList>
      </div>
    </div>
  );
}
