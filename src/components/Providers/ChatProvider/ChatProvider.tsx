import {ReactNode, useEffect, useState, useRef, useMemo, useCallback, useLayoutEffect} from "react";
import {ChatType, MessageType} from "@/types";
import {ChatContext} from "@/context/ChatContext.ts";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useLastReadMessage} from "@/components/Providers/ChatProvider/useLastReadMessage.ts";
import {useMessages} from "@/components/Providers/ChatProvider/useMessages.ts";
import {useLastMessage} from "@/components/Providers/ChatProvider/useLastMessage.ts";
import {useUnreadCount} from "@/components/Providers/ChatProvider/useUnreadCount.ts";
import {useUserRecipient} from "@/components/Providers/ChatProvider/useUserRecipient.ts";



interface ChatProviderProps {
  children: ReactNode,
}

export function ChatProvider({ children }: ChatProviderProps) {
  const {currentUser} = useAuthContext();
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const isNotExistRef = useRef(false);
  const lastReadMessage = useLastReadMessage({currentChat, isNotExist: isNotExistRef});
  const messages = useMessages({
    currentChat,
    isNotExist: isNotExistRef,
    lastReadMessageSnapshot: lastReadMessage.snapshot,
    lastReadMessageIsSuccess: lastReadMessage.isSuccess,
  });
  const {lastMessage, setLastMessage} = useLastMessage(currentChat?.id);
  const {unreadCount, setUnreadCount, incrementValue, setIncrementValue} = useUnreadCount(currentChat?.id);
  useUserRecipient({recipientId: currentChat?.user?.id, setCurrentChat});
  const [jumpTarget, setJumpTarget] = useState<MessageType | null>(null);

  const messageArrayForReturn = useMemo(() => {
    let read = true;
    return messages.messages?.map((message) => {
        message.isRead = read;
      if (message.id === lastReadMessage.lastReadMessage?.id) {
        read = false
      }
      if (message.id === jumpTarget?.id) {
        message.isJumpTo = true;
      }
      return message;
    })
  }, [messages.messages, lastReadMessage.lastReadMessage, jumpTarget]);


  useLayoutEffect(() => {
    if (!lastReadMessage.isSuccess || messages.isSuccess) {
      return
    }
    const lastReadIndex = messages.messages?.findIndex((message) => {
      return message.id === lastReadMessage?.lastReadMessage?.id
    })
    if (messages.messages?.length - 1 > lastReadIndex) {
      setJumpTarget(messages.messages[lastReadIndex + 1]);
    }
  }, [lastReadMessage.isSuccess, messages.isSuccess]);


  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (
        !currentChat?.id || !currentUser ||
        !lastReadMessage.lastReadMessage ||
        lastReadMessage.isCurrentMessage(lastReadMessage.lastReadMessage)
      ) {
        return;
      }
      await chatService.updateLastReadMessage({
        chatId: currentChat.id,
        userId: currentUser.uid,
        messageId: lastReadMessage.lastReadMessage.id,
      })
      if (unreadCount + incrementValue < 0) {
        await chatService.updateUnreadCount({
          chatId: currentChat.id,
          userId: currentUser.uid,
          value: 0
        })
      } else {
        await chatService.updateUnreadCount({
          chatId: currentChat.id,
          userId: currentUser.uid,
          increment: incrementValue
        })
      }
      setIncrementValue(0)
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [lastReadMessage.lastReadMessage]);


  async function jumpToLatestMessage() {
    if (!currentChat?.id || !currentUser?.uid || !lastMessage) {
      return;
    }
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


  const markRead = useCallback((message: MessageType) => {
    let isSaved = false;
    lastReadMessage.setLastReadMessage(prevMessage => {
      const prevMessageTime = prevMessage?.date.toDate().getTime() || 0;
      const MessageTime = message.date.toDate().getTime();
      if (MessageTime > prevMessageTime) {
        isSaved = true;
        return message
      }
      return prevMessage
    })
    if (message.senderId !== currentUser?.uid && isSaved) {
      setIncrementValue(prev => prev - 1)
    }
  }, [currentUser]);


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