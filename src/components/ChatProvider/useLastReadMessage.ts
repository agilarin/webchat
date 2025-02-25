import {useEffect, useState, Dispatch, SetStateAction, RefObject} from "react";
import {MessageType, ChatType} from "@/types";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {DocumentSnapshot} from "firebase/firestore";


export type UseLastReadMessage = {
  lastReadMessage: MessageType | null,
  setLastReadMessage: Dispatch<SetStateAction<MessageType | null>>,
  snapshot: DocumentSnapshot | null,
  isFetching: boolean,
  isCurrentMessage: (message: MessageType) => boolean,
  reset: () => void,
}

interface UseLastMessageProps {
  currentChat: ChatType | null
  isCreated: RefObject<boolean>,
}

export function useLastReadMessage({currentChat, isCreated}: UseLastMessageProps): UseLastReadMessage {
  const {currentUser} = useAuthContext();
  const [isFetching, setIsFetching] = useState(false);
  const [snapshot, setSnapshot] = useState<DocumentSnapshot | null>(null);
  const [message, setMessage] = useState<MessageType | null>(null);
  const [savedMessage, setSavedMessage] = useState<MessageType | null>(null);


  function isCurrentMessage(message: MessageType) {
    return savedMessage?.id === message?.id;
  }

  function reset() {
    setIsFetching(false)
    setSnapshot(null)
    setSavedMessage(null)
    setMessage(null)
  }


  useEffect(() => {
    if (isCreated.current) {
      return setIsFetching(true);
    }
    if (!currentChat || !currentUser) {
      return;
    }

    chatService.subscribeLastReadMessageAndSnapshot({
      chatId: currentChat.id,
      userId: currentUser.uid
    }, (message, snapshot) => {
      setSnapshot(snapshot || null)
      setSavedMessage(message || null)
      setMessage(message || null)
      setIsFetching(true)
    })
  }, [currentChat])


  return {
    lastReadMessage: message,
    setLastReadMessage: setMessage,
    snapshot,
    isFetching,
    isCurrentMessage,
    reset,
  }
}