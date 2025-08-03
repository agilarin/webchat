import { useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

import { useActiveChatStore, useMessagesStore } from "@/store";
import { useSortedMessages } from "@/hooks/store/useSortedMessages.ts";
import { useReadStatus } from "@/hooks/store/useReadStatus";
import { useScrollToMessage } from "./useScrollToMessage";
import { MessageItem } from "../MessageItem";
import { JumpButton } from "../JumpButton";
import { MessageBoundarySpinner } from "../MessageBoundarySpinner";
import { MessageListSkeleton } from "./MessageListSkeleton";
import { CustomVirtuosoList } from "./CustomVirtuosoList";
import classes from "./MessageList.module.scss";

export function MessageList() {
  const activeChat = useActiveChatStore.use.chat();

  const messages = useSortedMessages();
  const loading = useMessagesStore.use.loading();

  const firstItemIndex = useMessagesStore.use.firstItemIndex();
  const loadPrevMessages = useMessagesStore.use.loadPrevMessages();
  const loadNextMessages = useMessagesStore.use.loadNextMessages();
  const loadingPrev = useMessagesStore.use.loadingPrev();
  const loadingNext = useMessagesStore.use.loadingNext();
  const hasReachedStart = useMessagesStore.use.hasReachedStart();
  const hasReachedEnd = useMessagesStore.use.hasReachedEnd();

  const { lastReadMessageId } = useReadStatus(activeChat?.id);
  const lastReadIndex = messages.findIndex((m) => m.id === lastReadMessageId);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);

  const { scrollToLast } = useScrollToMessage({
    virtuosoRef,
    firstItemIndex,
    messages,
    chatId: activeChat?.id,
  });

  if (loading) return <MessageListSkeleton />;

  return (
    <div className={classes.root}>
      {!atBottom && <JumpButton onClick={scrollToLast} />}
      <Virtuoso
        className={classes.messageList}
        ref={virtuosoRef}
        firstItemIndex={firstItemIndex}
        initialTopMostItemIndex={lastReadIndex >= 0 ? lastReadIndex : 0}
        data={messages}
        totalCount={messages.length}
        startReached={hasReachedStart ? undefined : loadPrevMessages}
        endReached={hasReachedEnd ? undefined : loadNextMessages}
        followOutput={atBottom && hasReachedEnd}
        atBottomStateChange={setAtBottom}
        components={{
          Footer: () => (loadingNext ? <MessageBoundarySpinner /> : null),
          Header: () => (loadingPrev ? <MessageBoundarySpinner /> : null),
          List: CustomVirtuosoList,
        }}
        itemContent={(_, message) => <MessageItem message={message} />}
      />
    </div>
  );
}
