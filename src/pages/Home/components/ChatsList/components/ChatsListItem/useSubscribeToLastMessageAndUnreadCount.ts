import {useEffect, useMemo, useState} from "react";
import chatService from "@/services/chatService.ts";
import {MessageType} from "@/types";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";


export function useSubscribeToLastMessageAndUnreadCount(chatId: string | undefined) {
  const {currentUser} = useAuthContext();
  const {
    unreadCount: unreadCountChat,
    setLastMessage: setLastMessageChat,
    currentChat
  } = useChatContext();
  const [isFetching, setIsFetching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessage, setLastMessage] = useState<MessageType | null>();


  useEffect(() => {
    setUnreadCount(0);
    setLastMessage(null);
    setIsFetching(false);
    if (!chatId || !currentUser?.uid) {
      return setIsFetching(true);
    }
    const messageUnsub = chatService.subscribeToLastMessage(chatId, (message) => {
      if (currentChat?.id === chatId) {
        setLastMessageChat(message);
      }
        setLastMessage(message)
        setIsFetching(true)
      })
    const countUnsub = chatService.subscribeToUnreadCount(
      {chatId, userId: currentUser.uid},
      (count) => {
        setUnreadCount(count)
        setIsFetching(true)
      })
    return () => {
      messageUnsub()
      countUnsub()
    }
  }, [chatId, currentChat])


  const unreadCountResult = useMemo(() => {
    if  (currentChat?.id === chatId) {
      return unreadCountChat
    }
    return unreadCount;
  }, [unreadCount, unreadCountChat, currentChat])



  return {
    isFetching,
    unreadCount: unreadCountResult,
    lastMessage,
  };
}