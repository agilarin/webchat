import {useEffect, useState} from "react";
import {MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";



export function useLastMessage(chatId?: string) {
  const {currentUser} = useAuthContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);


  useEffect(() => {
    setLastMessage(null);
    setIsSuccess(false);
    if (!chatId || !currentUser?.uid) {
      return setIsSuccess(true);
    }
    const unsub = chatService.subscribeToLastMessage(chatId, (message) => {
      setLastMessage(message)
      setIsSuccess(true)
    })

    return () => unsub()
  }, [chatId])


  return {
    isSuccess,
    lastMessage,
    setLastMessage
  };
}