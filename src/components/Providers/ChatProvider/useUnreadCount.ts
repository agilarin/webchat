import {useEffect, useMemo, useState} from "react";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";


export function useUnreadCount(chatId?: string) {
  const {currentUser} = useAuthContext();
  const [isFetching, setIsFetching] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [incrementValue, setIncrementValue] = useState(0);


  useEffect(() => {
    setIsFetching(false);
    setUnreadCount(0);
    setIncrementValue(0)
    if (!chatId || !currentUser?.uid) {
      return setIsFetching(true);
    }
    const unsub = chatService.subscribeToUnreadCount(
      {chatId, userId: currentUser.uid},
      (count) => {
        setUnreadCount(count)
        setIsFetching(true)
      })
    return () => unsub()
  }, [chatId])


  const unreadCountResult = useMemo(() => {
    const result = unreadCount + incrementValue
    if (result < 0) {
      return 0;
    }
    return result;
  }, [unreadCount, incrementValue])


  return {
    isFetching,
    unreadCount: unreadCountResult,
    setUnreadCount,
    incrementValue,
    setIncrementValue,
    // incrementUnreadCount: (value: number) => setIncrementValue(prev => prev + value),
    // resetIncrement: () => setIncrementValue(0),
  };
}