import {RefObject, useEffect, useState, useRef, useLayoutEffect} from "react";
import {DocumentSnapshot} from "firebase/firestore";
import {ChatType, MessageType} from "@/types";
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
  loadPrev: () => Promise<boolean>,
  lastReadMessage: MessageType | null,
}

interface UseMessagesProps {
  currentChat: ChatType | null,
  // lastReadMessageSnapshot: DocumentSnapshot | null,
  // lastReadMessageIsSuccess: boolean,
  isNotExist: RefObject<boolean>,
}

export function useMessages({currentChat, isNotExist}: UseMessagesProps): UseMessagesReturn {
  const {currentUser} = useAuthContext()
  const [lastReadMessageIsSuccess, setLastReadMessageIsSuccess] = useState(false);
  const [lastReadMessageSnapshot, setLastReadMessageSnapshot] = useState<DocumentSnapshot | null>(null);
  const [lastReadMessage, setLastReadMessage] = useState<MessageType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasPrevRef = useRef<boolean>(true);


  useLayoutEffect(() => {
    setLastReadMessageIsSuccess(false)
    setLastReadMessageSnapshot(null)
    setLastReadMessage(null)
    setIsSuccess(false);
    setMessages([]);
    hasPrevRef.current = true;
  }, [currentChat]);
  

  useEffect(() => {
    if (isNotExist.current) {
      return setLastReadMessageIsSuccess(true);
    }
    if (!currentChat?.id || !currentUser) {
      return;
    }
    chatService.subscribeLastReadMessageAndSnapshot({
      chatId: currentChat.id,
      userId: currentUser.uid
    }, (message, snapshot) => {
      setLastReadMessageSnapshot(snapshot || null)
      setLastReadMessage(message || null)
      setLastReadMessageIsSuccess(true)
    })
  }, [currentChat])


  // function isLastRead(message: MessageType) {
  //   return lastReadMessage?.id === message?.id;
  // }


  useEffect(() => {
    if (isNotExist.current) {
      return setIsSuccess(true);
    }
    if (!lastReadMessageIsSuccess || !currentChat || !currentUser) {
      return;
    }
    const unsub = chatService.subscribeToMessages({
      chatId: currentChat.id,
      messagesSnapshot: lastReadMessageSnapshot || undefined,
    }, (messages) => {
      setMessages(prev => mergeMessages(prev, messages))
      setIsSuccess(true);
    });
    return () => unsub()
  }, [currentChat, lastReadMessageSnapshot, lastReadMessageIsSuccess]);


  async function loadPrev() {
    if (!currentChat?.id || !messages.length || !hasPrevRef.current) {
      return false;
    }
    const response = await chatService.getPrevMessages({
      chatId: currentChat.id,
      messageId: messages[0].id,
    });
    if (response) {
      setMessages(prev => mergeMessages(prev, response))
    }
    hasPrevRef.current = !!response;
    return !!response;
  }


  return {
    messages,
    isSuccess,
    loadPrev,
    lastReadMessage
  };
}