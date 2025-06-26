import {useEffect, useState, useCallback, Dispatch, SetStateAction} from "react";
import {DocumentSnapshot} from "firebase/firestore";
import {MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import { useAuthContext } from "@/hooks/useAuthContext.ts";

function sortMessagesOrderByAsc(messages: MessageType[]) {
  return messages.sort((messageA, messageB) => {
    return messageA.date.toDate().getTime() - messageB.date.toDate().getTime()
  });
}

function mergeMessages(oldMessages: MessageType[], newMessages: MessageType[]) {
  const result = [...oldMessages];
  newMessages.forEach(message => {
    const index = result.findIndex(item => item.id === message.id);
    if (index === -1) {
      result.push(message);
    } else {
      result[index] = message
    }
  });
  return sortMessagesOrderByAsc(result)
}

type UseMessagesReturn = {
  messages: MessageType[],
  isSuccess: boolean,
  addMessages: (message: MessageType[]) => void,
  lastReadMessage: MessageType | null,
  reset: () => void,
  hasMorePrev: boolean,
  setHasMorePrev: Dispatch<SetStateAction<boolean>>,
}

export function useMessages(chatId?: string, isNotExist?: boolean): UseMessagesReturn {
  const {currentUser} = useAuthContext()
  const [lastReadMessageIsSuccess, setLastReadMessageIsSuccess] = useState(false);
  const [lastReadMessageSnapshot, setLastReadMessageSnapshot] = useState<DocumentSnapshot | null>(null);
  const [lastReadMessage, setLastReadMessage] = useState<MessageType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasMorePrev, setHasMorePrev] = useState(false);

  function reset() {
    setLastReadMessageIsSuccess(false)
    setLastReadMessageSnapshot(null)
    setLastReadMessage(null)
    setIsSuccess(false);
    setMessages([]);
    setHasMorePrev(true)
  }

  useEffect(() => {
    if (isNotExist) {
      return setLastReadMessageIsSuccess(true);
    }
    if (!chatId || !currentUser) {
      return;
    }
    chatService.subscribeLastReadMessageAndSnapshot(
      {
        chatId,
        userId: currentUser.uid
      },
      (message, snapshot) => {
        setLastReadMessageSnapshot(snapshot || null)
        setLastReadMessage(message || null)
        setLastReadMessageIsSuccess(true)
      })
  }, [chatId, isNotExist])

  useEffect(() => {
    if (isNotExist) {
      return setIsSuccess(true);
    }
    if (!lastReadMessageIsSuccess || !chatId || !currentUser) {
      return;
    }
    const unsub = chatService.subscribeToMessages(
      {
        chatId,
        messagesSnapshot: lastReadMessageSnapshot || undefined
      },
      (messages) => {
        setMessages(prev => mergeMessages(prev, messages))
        setIsSuccess(true);
      });
    return () => unsub()
  }, [chatId, isNotExist, lastReadMessageSnapshot, lastReadMessageIsSuccess]);

  const addMessages = useCallback((message: MessageType[]) => {
    setMessages(prev => mergeMessages(prev, message))
  }, [setMessages])

  return {
    messages,
    isSuccess,
    addMessages,
    lastReadMessage,
    hasMorePrev,
    setHasMorePrev,
    reset,
  };
}