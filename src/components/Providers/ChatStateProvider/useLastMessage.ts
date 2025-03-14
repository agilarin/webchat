import {useEffect, useState} from "react";
import {MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";



export function useLastMessage(chatId?: string, isNotExist?: boolean) {
  const {currentUser} = useAuthContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);

  function reset() {
    setLastMessage(null);
    setIsSuccess(false);
  }

  useEffect(() => {
    if (isNotExist) {
      return setIsSuccess(true);
    }
    if (!chatId || !currentUser) {
      return;
    }
    const unsub = chatService.subscribeToLastMessage(chatId, (message) => {
      setLastMessage(message)
      setIsSuccess(true)
    })

    return () => unsub()
  }, [chatId, isNotExist])


  return {
    isSuccess,
    data: lastMessage,
    reset
  };
}