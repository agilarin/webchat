import {RefObject, useEffect, useState, useRef} from "react";
import {DocumentSnapshot} from "firebase/firestore";
import {ChatType, MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import { useAuthState } from "@/hooks/useAuthState";


interface useMessagesProps {
  currentChat: ChatType | null,
  lastReadMessageSnapshot: DocumentSnapshot | null,
  lastReadMessageIsFetching: boolean,
  isCreated: RefObject<boolean>,
}


export function useMessages({currentChat, lastReadMessageSnapshot, lastReadMessageIsFetching, isCreated}: useMessagesProps) {
  const {currentUser} = useAuthState()
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const isPrevRef = useRef<boolean>(true);


  function reset() {
    setMessages([]);
    setIsFetching(false);
    isPrevRef.current = true;
  }


  useEffect(() => {
    if (isCreated.current) {
      return setIsFetching(true);
    }
    if (!lastReadMessageIsFetching || !currentChat || !currentUser) {
      return;
    }
    const unsub = chatService.subscribeToMessages({
      chatId: currentChat.id,
      messagesSnapshot: lastReadMessageSnapshot || undefined,
    }, (messages) => {
      setMessages(prev => mergeMessages(prev, messages))
      setIsFetching(true);
    });
    return () => unsub()
  }, [currentChat, lastReadMessageSnapshot, lastReadMessageIsFetching]);


  function mergeMessages(oldMessages: MessageType[], newMessages: MessageType[]) {
    const result = [...oldMessages];
    newMessages.forEach(message => {
      const index = result.findIndex(item => item.id === message.id);
      if (index !== -1) {
        result[index] = message
      } else {
        result.push(message);
      }
    });
    return result.sort((mesA, mesB) => {
      return mesA.date.toDate().getTime() - mesB.date.toDate().getTime()
    });
  }


  async function fetchPrevMessages() {
    if (!currentChat?.id || !messages.length || !isPrevRef.current) {
      return false;
    }
    const response = await chatService.getPrevMessages({
      chatId: currentChat.id,
      messageId: messages[0].id,
    });
    if (response) {
      setMessages(prev => mergeMessages(prev, response))
    }
    isPrevRef.current = !!response;
    return !!response;
  }


  return {
    messages,
    isFetching,
    getPrevMessages: fetchPrevMessages,
    reset
  };
}