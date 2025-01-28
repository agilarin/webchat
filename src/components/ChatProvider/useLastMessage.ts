import {useEffect, useState} from "react";
import {MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import {useAuthState} from "@/hooks/useAuthState.ts";



export function useLastMessage(chatId?: string) {
  const {currentUser} = useAuthState();
  const [isFetching, setIsFetching] = useState(false);
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);


  useEffect(() => {
    setLastMessage(null);
    setIsFetching(false);
    if (!chatId || !currentUser?.uid) {
      return setIsFetching(true);
    }
    const unsub = chatService.subscribeToLastMessage(chatId, (message) => {
      setLastMessage(message)
      setIsFetching(true)
    })

    return () => unsub()
  }, [chatId])


  return {
    isFetching,
    lastMessage,
    setLastMessage
  };
}