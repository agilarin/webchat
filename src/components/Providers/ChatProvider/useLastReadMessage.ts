import {useEffect, useState, Dispatch, SetStateAction, RefObject} from "react";
import {DocumentSnapshot} from "firebase/firestore";
import {MessageType, ChatType} from "@/types";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";



type UseLastReadMessageReturn = {
  lastReadMessage: MessageType | null,
  setLastReadMessage: Dispatch<SetStateAction<MessageType | null>>,
  snapshot: DocumentSnapshot | null,
  isSuccess: boolean,
  isCurrentMessage: (message: MessageType) => boolean,
}

interface UseLastMessageProps {
  currentChat: ChatType | null,
  isNotExist: RefObject<boolean>
}

export function useLastReadMessage({currentChat, isNotExist}: UseLastMessageProps): UseLastReadMessageReturn {
  const {currentUser} = useAuthContext();
  const [isSuccess, setIsSuccess] = useState(false);
  const [snapshot, setSnapshot] = useState<DocumentSnapshot | null>(null);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [savedMessage, setSavedMessage] = useState<MessageType | null>(null);


  useEffect(() => {
    setIsSuccess(false)
    setSnapshot(null)
    setSavedMessage(null)
    setMessage(null)
  }, [currentChat]);


  useEffect(() => {
    if (isNotExist.current) {
      return setIsSuccess(true);
    }
    if (!currentChat?.id || !currentUser) {
      return;
    }
    chatService.subscribeLastReadMessageAndSnapshot({
      chatId: currentChat.id,
      userId: currentUser.uid
    }, (message, snapshot) => {
      setSnapshot(snapshot || null)
      setSavedMessage(message || null)
      setMessage(message || null)
      setIsSuccess(true)
    })
  }, [currentChat])


  function isCurrentMessage(message: MessageType) {
    return savedMessage?.id === message?.id;
  }


  return {
    lastReadMessage: message,
    setLastReadMessage: setMessage,
    snapshot,
    isSuccess,
    isCurrentMessage,
  }
}