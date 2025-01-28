import {ReactNode, useEffect, useState, useRef, useLayoutEffect, useMemo} from "react";
import {ChatType} from "@/types";
import {ChatContext} from "@/context/ChatContext.ts";
import chatService from "@/services/chatService.ts";
import {useAuthState} from "@/hooks/useAuthState.ts";
import {useLastReadMessage} from "@/components/ChatProvider/useLastReadMessage.ts";
import {useMessages} from "@/components/ChatProvider/useMessages.ts";
import {useLastMessage} from "@/components/ChatProvider/useLastMessage.ts";
import {useUnreadCount} from "@/components/ChatProvider/useUnreadCount.ts";
import {useUserRecipient} from "@/components/ChatProvider/useUserRecipient.ts";




interface ChatProviderProps {
  children: ReactNode,
}

function ChatProvider({ children }: ChatProviderProps) {
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const {currentUser} = useAuthState();
  const isCreatedRef = useRef(false);
  const lastReadMessage = useLastReadMessage({currentChat, isCreated: isCreatedRef});
  const messages = useMessages({
    currentChat,
    lastReadMessageSnapshot: lastReadMessage.snapshot,
    lastReadMessageIsFetching: lastReadMessage.isFetching,
    isCreated: isCreatedRef,
  });
  const {lastMessage, setLastMessage} = useLastMessage(currentChat?.id);
  const {unreadCount, setUnreadCount, incrementValue, setIncrementValue, resetUnreadCount} = useUnreadCount(currentChat?.id);
  useUserRecipient({recipientId: currentChat?.user?.id, setCurrentChat})

  const messagesWithIsRead = useMemo(() => {
    let read = true;
    return messages.messages?.map((message) => {
        message.isRead = read;
      if (message.id === lastReadMessage.lastReadMessage?.id) {
        read = false
      }
      return message;
    })
  }, [messages.messages, lastReadMessage.lastReadMessage]);


  useLayoutEffect(() => {
    messages.reset();
    lastReadMessage.reset()
    resetUnreadCount();
  }, [currentChat]);


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


  async function goToLastMessage() {
    if (!currentChat?.id || !currentUser?.uid || !lastMessage?.id) {
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


  return (
    <ChatContext.Provider value={{
      currentChat,
      setCurrentChat,
      isCreated: isCreatedRef,

      messages: messagesWithIsRead,
      messagesIsFetching: messages.isFetching,
      getPrevMessages: messages.getPrevMessages,
      goToLastMessage,

      lastReadMessage: lastReadMessage.lastReadMessage,
      setLastReadMessage: lastReadMessage.setLastReadMessage,
      lastReadMessageIsFetching: lastReadMessage.isFetching,

      setLastMessage,

      unreadCount,
      setUnreadCount,
      incrementUnreadCount: (value: number) => setIncrementValue(prev => prev + value),
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;