import {useEffect, useRef} from "react";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {useInView} from "@/hooks/useInView.ts";
import {combineRefs} from "@/utils/combineRefs.ts";
import {LoadingProgress} from "@/components/UI/LoadingProgress";
import {MessageItem} from "@/pages/Home/components/Chat/components/MessageItem";
import {useScrollSaveOnChange} from "./useScrollSaveOnChange.ts";
import classes from "./MessageList.module.scss";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";



export function MessageList() {
  const {
    messages,
    messagesIsSuccess,
    loadPrev,
    unreadCount,
    jumpToLatestMessage
  } = useChatContext();
  const listRef = useRef<HTMLDivElement | null>(null)
  const loadPrevTrigger = useInView({ rootMargin: "1000px" });
  const jumpToEndTrigger = useInView();
  const {scrollRef, addScrollSaveEvent} = useScrollSaveOnChange();


  useEffect(() => {
    if (loadPrevTrigger.isVisible && messagesIsSuccess && messages.length) {
      const removeScrollSaveEvent = addScrollSaveEvent();
      loadPrev().finally(() => removeScrollSaveEvent())
    }
  }, [loadPrevTrigger.isVisible, messagesIsSuccess, messages])


  function handleJumpToEnd() {
    if (unreadCount > 0) {
      jumpToLatestMessage();
    }
    listRef.current?.scrollTo(0, 0);
  }


  if (!messagesIsSuccess) {
    return (
      <div className={classes.root}>
        <div className={classes.progressContainer}>
          <div className={classes.progress}>
            <LoadingProgress/>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={classes.root}>
      <div
        ref={combineRefs(loadPrevTrigger.rootRef, listRef, scrollRef, jumpToEndTrigger.rootRef)}
        className={classes.list}
      >
        <div
          ref={jumpToEndTrigger.ref}
          className={classes.btnJumpToEndTrigger}
        />
        <div>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
            />
          ))}
        </div>
        <div
          ref={loadPrevTrigger.ref}
          className={classes.loadPrevTrigger}
        />
      </div>

      {(!jumpToEndTrigger.isVisible || unreadCount > 0) && (
        <button
          className={classes.btnJumpToEnd}
          onClick={handleJumpToEnd}
        >
          <ArrowDownIcon className={classes.btnJumpToEndIcon}/>
          {unreadCount > 0 && (
            <span className={classes.btnJumpToEndNotify}>
              {unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}