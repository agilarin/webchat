import {ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {MessageType} from "@/types";
import chatService from "@/services/chatService.ts";
import {ChatStateContext} from "@/context/ChatStateContext.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {useMessages} from "./useMessages.ts";
import {useLastMessage} from "./useLastMessage.ts";
import {useUnreadCount} from "./useUnreadCount.ts";
import {debounce} from "@/utils/debounce.ts";


interface ChannelProviderProps {
  children: ReactNode
}

export function ChatStateProvider({ children }: ChannelProviderProps) {
  const {currentUser} = useAuthContext();
  const {activeChat, isNotExist} = useChatContext();
  const messages = useMessages(activeChat?.id, isNotExist);
  const lastMessage = useLastMessage(activeChat?.id, isNotExist);
  const unreadCount = useUnreadCount(activeChat?.id, isNotExist);
  const [messagesReturn, setMessagesReturn] = useState<MessageType[]>([]);
  const [messagesReturnIsSuccess, setMessagesReturnIsSuccess] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [jumpTarget, setJumpTarget] = useState<MessageType | null>(null);
  const [newLastReadMessage, setNewLastReadMessage] = useState<MessageType | null>(null);


  useLayoutEffect(() => {
    lastMessage.reset()
    unreadCount.reset()
    messages.reset()
    setMessagesReturn([]);
    setJumpTarget(null)
    setNewLastReadMessage(null)
    setReadCount(0)
  }, [activeChat?.id]);


  useEffect(() => {
    if (!messages.isSuccess) {
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
    debounce(async (func: () => void) => func(), 2000),
    [activeChat?.id])


  useEffect(() => {
    const chatId = activeChat?.id;
    const userId = currentUser?.uid;
    if (
      !chatId || !userId ||
      !newLastReadMessage ||
      !readCount || isNotExist
    ) {
      return;
    }
    debouncedUpdateChatState(async () => {
      await chatService.updateLastReadMessage({ chatId, userId, messageId: newLastReadMessage.id })
      if (unreadCount.data - readCount < 0) {
        await chatService.updateUnreadCount({ chatId, userId, value: 0 })
      } else {
        await chatService.updateUnreadCount({ chatId, userId, increment: -readCount })
      }
      setReadCount(0)
    })
  }, [debouncedUpdateChatState, newLastReadMessage, unreadCount, readCount]);


  useEffect(() => {
    if (!newLastReadMessage || !activeChat?.id) {
      return;
    }
    const notUserMessages = messagesReturn?.filter((message) => {
      return message.senderId !== currentUser?.uid
    })
    const lastReadIndex = notUserMessages?.findIndex(item => {
      return item.id === messages.lastReadMessage?.id
    });
    const newLastReadIndex = notUserMessages?.findIndex(item => {
      return item.id === newLastReadMessage.id
    })
    const newReadCount = newLastReadIndex - lastReadIndex;
    if (newReadCount > -1) {
      setReadCount(newReadCount)
    }
  }, [newLastReadMessage, activeChat]);


  useEffect(() => {
    if (!messages.isSuccess || !messages.messages.length) {
      return;
    }
    const lastReadIndex = messages.messages.findIndex(message => {
      return message.id === (newLastReadMessage?.id || messages.lastReadMessage?.id)
    });
    setMessagesReturn(messages.messages?.map((message, i) => {
      message.isRead = i <= lastReadIndex;
      if (message.id === jumpTarget?.id) {
        message.isJumpTo = true;
      }
      return message;
    }));
    setMessagesReturnIsSuccess(true);
  }, [messages.isSuccess, messages.messages, messages.lastReadMessage, newLastReadMessage, jumpTarget]);


  const unreadCountReturn = useMemo(() => {
    const sum = unreadCount.data - readCount;
    if (sum < 0) {
      return 0;
    }
    return sum;
  }, [unreadCount.data, readCount])


  return (
    <ChatStateContext.Provider value={{
      messages: messagesReturn,
      messagesIsSuccess: messagesReturnIsSuccess,
      addMessages: messages.addMessages,
      hasMorePrev: false,
      setHasMorePrev: messages.setHasMorePrev,
      rawUnreadCount: unreadCount.data,
      readCount,
      unreadCount: unreadCountReturn,
      setReadCount,
      setLastReadMessage: setNewLastReadMessage,
      lastMessage: lastMessage.data,
    }}>
      {children}
    </ChatStateContext.Provider>
  );
}