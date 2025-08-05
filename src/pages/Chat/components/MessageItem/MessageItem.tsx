import { memo, useEffect, useRef } from "react";
import clsx from "clsx";

import { Message } from "@/types";
import {
  useActiveChatStore,
  useCurrentUserStore,
  useReadStatusesStore,
} from "@/store";
import { useReadStatusLoading } from "@/hooks/store/useLoadingById";
import { useInView } from "@/hooks/useInView.ts";
import { formatMessageDate } from "@/utils/formatDate.ts";
import { combineRefs } from "@/utils/combineRefs.ts";
import classes from "./MessageItem.module.scss";

interface MessagesListItemProps {
  message: Message;
}
export const MessageItem = memo(function MessageItem({
  message,
}: MessagesListItemProps) {
  const activeChat = useActiveChatStore.use.chat();
  const authUser = useCurrentUserStore.use.authUser();
  const readStatusLoading = useReadStatusLoading(activeChat?.id);
  const markRead = useReadStatusesStore.use.markRead();

  const elementRef = useRef<HTMLDivElement>(null);
  const wasVisible = useRef(false);
  const { ref, isVisible } = useInView({ threshold: 0.75 });

  useEffect(() => {
    if (
      !isVisible ||
      wasVisible.current ||
      !activeChat?.id ||
      readStatusLoading
    ) {
      return;
    }
    markRead(activeChat?.id, message);
    wasVisible.current = true;
  }, [isVisible, message, activeChat?.id, readStatusLoading]);

  return (
    <div
      ref={combineRefs(ref, elementRef)}
      className={clsx(
        classes.messageRoot,
        message.senderId === authUser?.id
          ? [classes.right, classes.active]
          : classes.left
      )}
    >
      <div className={classes.date}>{formatMessageDate(message.createdAt)}</div>
      <div
        className={classes.message}
        dangerouslySetInnerHTML={{ __html: message.text }}
      />
    </div>
  );
});
