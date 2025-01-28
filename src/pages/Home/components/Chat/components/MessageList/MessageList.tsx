import {useEffect, useRef} from "react";
import {useChatState} from "@/hooks/useChatState.ts";
import {useInView} from "@/hooks/useInView.ts";
import {combineRefs} from "@/utils/combineRefs.ts";
import {LoadingProgress} from "@/components/UI/LoadingProgress";
import {MessageListItem} from "@/pages/Home/components/Chat/components/MessageList/components/MessageListItem";
import useChangeScrollHeight from "@/pages/Home/components/Chat/components/MessageList/useChangeScrollHeight.ts";
import classes from "./MessageList.module.scss";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";



function MessageList() {
  const {
    messages,
    messagesIsFetching,
    lastReadMessage,
    getPrevMessages,
    unreadCount,
    goToLastMessage
  } = useChatState();
  const listRef = useRef<HTMLDivElement | null>(null)
  const {ref, isVisible, rootRef} = useInView({rootMargin: "1000px" });
  const {scrollRef, heightRef} = useChangeScrollHeight();


  useEffect(() => {
    if (isVisible && messagesIsFetching && messages.length) {
      getPrevMessages()
    }
  }, [isVisible, messagesIsFetching, messages])


  function handleToEnd() {
    goToLastMessage();
    listRef.current?.scrollTo(0, 0);
  }


  if (!messagesIsFetching) {
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
      <div ref={combineRefs(rootRef, listRef, scrollRef)} className={classes.list}>
        <div ref={heightRef}>
          {messages.map((message) => (
            <MessageListItem
              key={message.id}
              message={message}
              isLastRead={message.id === lastReadMessage?.id}
              isRead={message.isRead}
            />
          ))}
        </div>
        <div ref={ref} className={classes.prevTrigger}/>
      </div>


      {unreadCount > 0 && (
        <button className={classes.buttonToEnd} onClick={handleToEnd}>
          <ArrowDownIcon className={classes.buttonToEndIcon}/>
        </button>
      )}
    </div>
  );
}

export default MessageList;