import clsx from "clsx";
import {useUserChatsContext} from "@/hooks/useUserChatsContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {ChatItem, ChatItemSkeleton} from "@/pages/Home/components/ChatItem";
import classes from "./ChatList.module.scss";


export function ChatList() {
  const {activeChat} = useChatContext();
  const {items, isSuccess} = useUserChatsContext();


  if (!isSuccess) {
    return (
      <ul className={clsx(classes.chatListRoot, "not-scroll")}>
        {Array(20).fill(0).map((_, i) => (
          <ChatItemSkeleton key={i}/>
        ))}
      </ul>
    );
  }


  return (
    <ul className={classes.chatListRoot}>
      {items.map(({chat, lastMessage, unreadCount}) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          lastMessage={lastMessage}
          count={unreadCount}
          active={chat.id === activeChat?.id}
        />
      ))}
    </ul>
  );
}