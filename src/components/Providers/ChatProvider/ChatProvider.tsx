import {ReactNode, useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect} from "react";
import {ChatType, MessageType} from "@/types";
import {ChatContext} from "@/context/ChatContext.ts";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useMessages} from "@/components/Providers/ChatProvider/useMessages.ts";
import {useLastMessage} from "@/components/Providers/ChatProvider/useLastMessage.ts";
import {useUnreadCount} from "@/components/Providers/ChatProvider/useUnreadCount.ts";
import {useUserRecipient} from "@/components/Providers/ChatProvider/useUserRecipient.ts";
import {debounce} from "@/utils/debounce.ts";



interface ChatProviderProps {
  children: ReactNode,
}

export function ChatProvider({ children }: ChatProviderProps) {
  const {currentUser} = useAuthContext();
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const isNotExistRef = useRef(false);
  const messages = useMessages({ currentChat, isNotExist: isNotExistRef });
  const {lastMessage, setLastMessage} = useLastMessage(currentChat?.id);
  const {unreadCount, setUnreadCount, incrementValue, setIncrementValue} = useUnreadCount(currentChat?.id);
  useUserRecipient({recipientId: currentChat?.user?.id, setCurrentChat});
  const [jumpTarget, setJumpTarget] = useState<MessageType | null>(null);
  const [newLastReadMessage, setNewLastReadMessage] = useState<MessageType | null>(null);


  const messageArrayForReturn = useMemo(() => {
    const lastReadId = newLastReadMessage?.id || messages.lastReadMessage?.id;
    const lastReadIndex = messages.messages.findIndex(message => message.id === lastReadId);
    return messages.messages?.map((message, i) => {
      message.isRead = i <= lastReadIndex;
      if (message.id === jumpTarget?.id) {
        message.isJumpTo = true;
      }
      return message;
    })
  }, [messages.messages, messages.lastReadMessage, newLastReadMessage, jumpTarget]);


  useLayoutEffect(() => {
    if (messages.isSuccess) {
      return
    }
    const lastReadIndex = messages.messages?.findIndex((message) => {
      return message.id === messages?.lastReadMessage?.id
    })
    if (messages.messages?.length - 1 > lastReadIndex) {
      setJumpTarget(messages.messages[lastReadIndex + 1]);
    }
  }, [messages.isSuccess]);



  const debouncedUpdateChatState = useCallback(
    debounce(async (func: () => void) => func(), 2000)
    , [currentChat?.id])


  useEffect(() => {
    const chatId = currentChat?.id;
    const userId = currentUser?.uid;
    if (
      !chatId || !userId ||
      !newLastReadMessage ||
      !incrementValue
    ) {
      return;
    }
    debouncedUpdateChatState(async () => {
      await chatService.updateLastReadMessage({ chatId, userId, messageId: newLastReadMessage.id })
      if (unreadCount + incrementValue < 0) {
        await chatService.updateUnreadCount({ chatId, userId, value: 0 })
      } else {
        await chatService.updateUnreadCount({ chatId, userId, increment: incrementValue })
      }
      setIncrementValue(0)
    })
  }, [currentChat, currentUser ,newLastReadMessage, unreadCount, incrementValue]);



  async function jumpToLatestMessage() {
    if (!currentChat?.id || !currentUser?.uid || !lastMessage) {
      return;
    }
    setIncrementValue(-unreadCount);
    await chatService.updateLastReadMessage({
      chatId: currentChat.id,
      userId: currentUser.uid,
      messageId: lastMessage.id
    })
    await chatService.updateUnreadCount({
      chatId: currentChat.id,
      userId: currentUser.uid,
      value: 0
    })
    setIncrementValue(0);
  }


  useEffect(() => {
    if (!newLastReadMessage) {
      return;
    }
    const notUserMessages = messageArrayForReturn?.filter((message) => {
      return message.senderId !== currentUser?.uid
    })
    const lastReadIndex = notUserMessages?.findIndex(item => {
      return item.id === messages.lastReadMessage?.id
    });
    const newLastReadIndex = notUserMessages?.findIndex(item => {
      return item.id === newLastReadMessage.id
    })
    const newIncrementValue = newLastReadIndex - lastReadIndex;
    if (newIncrementValue > -1) {
      setIncrementValue(-newIncrementValue)
    }
  }, [newLastReadMessage, currentUser]);


  const markRead = useCallback((message: MessageType) => {
    setNewLastReadMessage(prevMessage => {
      const prevMessageTime = prevMessage?.date.toDate().getTime() || 0;
      const MessageTime = message.date.toDate().getTime();
      if (MessageTime > prevMessageTime) {
        return message
      }
      return prevMessage
    })
    if (message.senderId !== currentUser?.uid) {
      setIncrementValue(prev => prev - 1);
    }
  }, [currentUser, setNewLastReadMessage]);


  return (
    <ChatContext.Provider value={{
      currentChat,
      setCurrentChat,
      isNotExist: isNotExistRef,

      messages: messageArrayForReturn,
      messagesIsSuccess: messages.isSuccess,
      loadPrev: messages.loadPrev,

      jumpToLatestMessage,
      markRead,
      setLastMessage,

      unreadCount,
      setUnreadCount
    }}>
      {children}
    </ChatContext.Provider>
  );
}