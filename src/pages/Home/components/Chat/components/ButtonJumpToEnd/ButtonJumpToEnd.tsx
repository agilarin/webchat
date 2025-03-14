import {useEffect, useLayoutEffect, useState} from "react";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {useChatStateContext} from "@/hooks/useChatStateContext.ts";
import {useChatActionContext} from "@/hooks/useChatActionContext.ts";
import {useInView} from "@/hooks/useInView.ts";
import classes from "./ButtonJumpToEnd.module.scss";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";


interface ButtonJumpToEndProps {
  rootElement: Element | null
  triggerElement: Element | null
}

export function ButtonJumpToEnd({rootElement, triggerElement}: ButtonJumpToEndProps) {
  const {activeChat} = useChatContext();
  const {unreadCount} = useChatStateContext();
  const {jumpToLatestMessage} = useChatActionContext();
  const {ref, isVisible} = useInView();
  const [isShow, setIsShow] = useState(false);


  useLayoutEffect(() => {
    const timeoutId = setTimeout(() => setIsShow(true), 20);
    return () => clearTimeout(timeoutId);
  }, [activeChat?.id])


  useEffect(() => {
    ref(triggerElement)
  }, [triggerElement])


  const handleJumpToEnd =() => {
    if (unreadCount > 0) {
      jumpToLatestMessage();
    }
    rootElement?.scrollTo(0, 0);
  }


  if (isVisible && unreadCount <= 0 || !isShow) {
    return null;
  }

  return (
    <button
      className={classes.btn}
      onClick={handleJumpToEnd}
    >
      <ArrowDownIcon className={classes.icon}/>
      {unreadCount > 0 && (
        <span className={classes.notify}>
          {unreadCount}
        </span>
      )}
    </button>
  );
}