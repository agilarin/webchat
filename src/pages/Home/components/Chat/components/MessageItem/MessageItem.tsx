import {useEffect, useRef} from "react";
import clsx from "clsx";
import {MessageType} from "@/types";
import {useInView} from "@/hooks/useInView.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useChatActionContext} from "@/hooks/useChatActionContext.ts";
import {formatMessageDate} from "@/utils/formatDate.ts";
import {combineRefs} from "@/utils/combineRefs.ts";
import classes from "./MessageItem.module.scss";


interface MessagesListItemProps {
  message: MessageType,
}

export function MessageItem({message}: MessagesListItemProps) {
  const {currentUser} = useAuthContext();
  const {markRead} = useChatActionContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const wasVisible = useRef(false);
  const {ref, isVisible} = useInView({threshold: 0.75});


  useEffect(() => {
    if (message.isJumpTo) {
      elementRef.current?.scrollIntoView()
    }
  }, [message.isJumpTo]);


  useEffect(() => {
    if (!isVisible || message?.isRead || wasVisible.current) {
      return;
    }
    markRead(message);
    wasVisible.current = true;
  }, [isVisible, message]);


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