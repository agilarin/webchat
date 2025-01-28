import clsx from "clsx";
import {ChatsListItem, ChatsListItemSkeleton} from "@/pages/Home/components/ChatsList/components/ChatsListItem";
import {ChatType, UserType} from "@/types";
import {useChatState} from "@/hooks/useChatState.ts";
import classes from "./ChatsList.module.scss";


interface ChatsListProps {
  users?: UserType[],
  chats?: ChatType[],
}

function ChatsList({users, chats}: ChatsListProps) {
  const {currentChat} = useChatState();


  if (users?.length) {
    return (
      <ul className={classes.root}>
        {users.map(item => (
          <ChatsListItem
            key={item.id}
            user={item}
            active={item.id === currentChat?.id}
          />
        ))}
      </ul>
    );
  }

  if (chats?.length) {
    return (
      <ul className={classes.root}>
        {chats.map(item => (
          <ChatsListItem
            key={item.id}
            chat={item}
            active={item.id === currentChat?.id}
          />
        ))}
      </ul>
    );
  }


  return (
    <ul className={clsx(classes.root, "not-scroll")}>
      {Array(20).fill(0).map((_, i) => (
        <ChatsListItemSkeleton key={i}/>
      ))}
    </ul>
  );
}

export default ChatsList;