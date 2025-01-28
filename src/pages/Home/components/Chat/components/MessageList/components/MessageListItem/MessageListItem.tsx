import {useEffect, useRef} from "react";
import clsx from "clsx";
import {MessageType} from "@/types";
import {useInView} from "@/hooks/useInView.ts";
import {useAuthState} from "@/hooks/useAuthState.ts";
import {useChatState} from "@/hooks/useChatState.ts";
import {formatMessageDate} from "@/utils/formatDate.ts";
import {combineRefs} from "@/utils/combineRefs.ts";
import classes from "./MessageListItem.module.scss";


interface MessagesListItemProps {
  message: MessageType,
  isLastRead?: boolean,
  isRead?: boolean,
  lastElementRef?: (node: Element | null) => void,
}

function MessageListItem({ message, isLastRead, isRead}: MessagesListItemProps) {
  const {currentUser} = useAuthState();
  const {setLastReadMessage, incrementUnreadCount} = useChatState();
  const wasVisible = useRef(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const {ref, isVisible} = useInView();


  useEffect(() => {
    if (isLastRead) {
      elementRef.current?.scrollIntoView()
    }
  }, []);


  useEffect(() => {
    if (!isVisible || isRead) {
      return;
    }
    setLastReadMessage(prevMessage => {
      const prevMessageTimestamp = prevMessage?.date.toDate().getTime() || 0;
      const MessageTimestamp = message.date.toDate().getTime();
      if (MessageTimestamp > prevMessageTimestamp) {
        return message
      }
      return prevMessage
    })

    if (!wasVisible.current && currentUser?.uid && message.senderId !== currentUser?.uid) {
      incrementUnreadCount(-1);
    }
    wasVisible.current = true;
  }, [isVisible, isRead]);


  return (
    <div
      ref={combineRefs(ref, elementRef)}
      className={clsx(classes.root, message.senderId === currentUser?.uid && classes.active)}
    >
      <div className={classes.date}>
        {formatMessageDate(message.date)}
      </div>
      <div className={classes.message}>
        {message.text}
      </div>
    </div>
  );
}

export default MessageListItem;