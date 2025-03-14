import {useRef, memo} from "react";
import {useChatStateContext} from "@/hooks/useChatStateContext.ts";
import {useChatActionContext} from "@/hooks/useChatActionContext.ts";
import {combineRefs} from "@/utils/combineRefs.ts";
import {LoadingProgress} from "@/components/UI/LoadingProgress";
import {MessageItem} from "@/pages/Home/components/Chat/components/MessageItem";
import {ButtonJumpToEnd} from "@/pages/Home/components/Chat/components/ButtonJumpToEnd";
import {LoadPrevTrigger} from "@/pages/Home/components/Chat/components/LoadPrevTrigger";
import {useScrollSaveOnChange} from "./useScrollSaveOnChange.ts";
import classes from "./MessageList.module.scss";



export const MessageList = memo(function MessageList() {
  const {messages, messagesIsSuccess} = useChatStateContext();
  const {loadPrev} = useChatActionContext();
  const listRef = useRef<HTMLDivElement | null>(null)
  const jumpToEndTriggerRef = useRef<HTMLDivElement | null>(null)
  const {scrollRef, addScrollSaveEvent} = useScrollSaveOnChange();


  async function handleLoadPrevVisible(isVisible: boolean) {
    if (isVisible && messagesIsSuccess && messages.length) {
      const removeScrollSaveEvent = addScrollSaveEvent();
      await loadPrev()
      removeScrollSaveEvent()
    }
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
        ref={combineRefs(listRef, scrollRef)}
        className={classes.list}
      >
        <div
          ref={jumpToEndTriggerRef}
          className={classes.jumpToEndTrigger}
        />
        <div>
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
            />
          ))}
        </div>
        <LoadPrevTrigger
          rootElement={listRef.current}
          onVisible={handleLoadPrevVisible}
        />
      </div>
      <ButtonJumpToEnd
        rootElement={listRef.current}
        triggerElement={jumpToEndTriggerRef.current}
      />
    </div>
  );
});