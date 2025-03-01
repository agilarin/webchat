import {RefObject, useEffect, useState, useRef} from "react";
import {DocumentSnapshot} from "firebase/firestore";
import {ChatType, MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import { useAuthContext } from "@/hooks/useAuthContext.ts";



type UseMessagesReturn = {
  messages: MessageType[],
  isSuccess: boolean,
  loadPrev: () => Promise<boolean>,
}

interface UseMessagesProps {
  currentChat: ChatType | null,
  lastReadMessageSnapshot: DocumentSnapshot | null,
  lastReadMessageIsSuccess: boolean,
  isNotExist: RefObject<boolean>,
}

export function useMessages({currentChat, lastReadMessageSnapshot, lastReadMessageIsSuccess, isNotExist}: UseMessagesProps): UseMessagesReturn {
  const {currentUser} = useAuthContext()
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasPrevRef = useRef<boolean>(true);


  useEffect(() => {
    setMessages([]);
    setIsSuccess(false);
    hasPrevRef.current = true;
  }, [currentChat]);


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
    return result.sort((mesA, mesB) => {
      return mesA.date.toDate().getTime() - mesB.date.toDate().getTime()
    });
  }


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
  };
}