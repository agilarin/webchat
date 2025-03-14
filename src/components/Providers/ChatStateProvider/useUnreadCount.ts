import {useEffect, useState} from "react";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";


export function useUnreadCount(chatId?: string, isNotExist?: boolean) {
  const {currentUser} = useAuthContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  function reset() {
    setIsSuccess(false);
    setUnreadCount(0);
  }

  useEffect(() => {
    if (!chatId || !currentUser || isNotExist) {
      return setIsSuccess(true);
    }
    const unsub = chatService.subscribeToUnreadCount(
      {chatId, userId: currentUser.uid},
      (count) => {
        setUnreadCount(count)
        setIsSuccess(true)
      })
    return () => unsub()
  }, [chatId, isNotExist])


  return {
    data: unreadCount,
    isSuccess,
    reset
  };
}