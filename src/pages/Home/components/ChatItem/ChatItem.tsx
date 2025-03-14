import {memo} from "react";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";
import {ChatType, MessageType, UserType} from "@/types";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {formatDate} from "@/utils/formatDate.ts";
import {Avatar} from "@/pages/Home/components/Avatar";
import classes from "./ChatItem.module.scss";


interface ChatsListItemProps {
  active?: boolean,
  user?: UserType,
  chat?: ChatType,
  lastMessage?: MessageType | null,
  count?: number,
}

export const ChatItem = memo(function ChatItem({ active, user, chat, lastMessage, count }: ChatsListItemProps) {
  const {createChat, watchChat} = useChatContext();
  const {currentUser} = useAuthContext();
  let title = "";
  let subTitle = "";


  if (user) {
    title = [user?.firstName, user?.lastName].join(" ");
    subTitle = "@" + user?.username;
  }
  if (chat) {
    title = chat?.title || [chat?.user?.firstName, chat?.user?.lastName].join(" ");
    subTitle = lastMessage?.text || "";
  }


  function handleChatClick() {
    if (chat) {
      return watchChat(chat);
    }
    if (!user?.id || !currentUser?.uid) {
      return;
    }
    createChat({
      type: "PRIVATE",
      user: user
    })
  }


  return (
    <li
      className={clsx(classes.root, classes.hover, active && classes.active)}
      onClick={handleChatClick}
    >

      <Avatar title={title}/>

      <div className={classes.content}>
        <div className={classes.info}>
          <h4 className={classes.title}>
            {title}
          </h4>
          <p className={classes.lastMessage}>
            {subTitle || <Skeleton width="100%"/>}
          </p>
        </div>

        {!!(count || lastMessage) && (
          <div className={classes.messageDateAndCount}>
            {!!lastMessage && (
              <span className={classes.lastMessageDate}>
                {formatDate(lastMessage.date)}
              </span>
            )}
            {!!count && (
              <div className={classes.messageCount}>
                  <span className={classes.messageCountText}>
                    {count}
                  </span>
              </div>
            )}
          </div>
        )}
      </div>

    </li>
  );
})