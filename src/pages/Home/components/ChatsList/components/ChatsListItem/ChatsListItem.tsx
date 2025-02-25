import clsx from "clsx";
import {ChatType, UserType} from "@/types";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {formatDate} from "@/utils/formatDate.ts";
import {Timestamp} from "firebase/firestore";
import {Avatar} from "@/pages/Home/components/Avatar";
import {useSubscribeToLastMessageAndUnreadCount} from "@/pages/Home/components/ChatsList/components/ChatsListItem/useSubscribeToLastMessageAndUnreadCount.ts";
import classes from "./ChatsListItem.module.scss";
import Skeleton from "react-loading-skeleton";


interface ChatsListItemProps {
  active?: boolean,
  user?: UserType,
  chat?: ChatType,
}

function ChatsListItem({ active, user, chat }: ChatsListItemProps) {
  const {unreadCount, lastMessage} = useSubscribeToLastMessageAndUnreadCount(chat?.id);
  const {setCurrentChat, isCreated} = useChatContext();
  const {currentUser} = useAuthContext();
  const data = {
    title: "",
    subTitle: "",
  }

  if (user) {
    data.title = [user?.firstName, user?.lastName].join(" ");
    data.subTitle = "@" + user?.username;
  }
  if (chat) {
    data.title = chat?.title || [chat?.user?.firstName, chat?.user?.lastName].join(" ");
    data.subTitle = lastMessage?.text || "";
  }


  function handleChatClick() {
    if (chat) {
      return setCurrentChat(chat);
    }
    if (!user?.id || !currentUser?.uid) {
      return;
    }

    setCurrentChat({
      id: "",
      type: "PRIVATE",
      createdAt: Timestamp.fromDate(new Date()),
      members: [currentUser.uid, user.id]
    });
    isCreated.current = true
  }


  return (
    <li
      className={clsx(classes.root, classes.hover, active && classes.active)}
      onClick={handleChatClick}
    >

      <Avatar title={data.title}/>

      <div className={classes.content}>
        <div className={classes.info}>
          <h4 className={classes.title}>
            {data.title}
          </h4>
          <p className={classes.lastMessage}>
            {data.subTitle || <Skeleton width="100%"/>}
          </p>
        </div>

        {!!(unreadCount || lastMessage) && (
          <div className={classes.messageDateAndCount}>
            {!!lastMessage && (
              <span className={classes.lastMessageDate}>
                {formatDate(lastMessage.date)}
              </span>
            )}
            {!!unreadCount && (
              <div className={classes.messageCount}>
                  <span className={classes.messageCountText}>
                    {unreadCount}
                  </span>
              </div>
            )}
          </div>
        )}
      </div>

    </li>
  );
}

export default ChatsListItem;