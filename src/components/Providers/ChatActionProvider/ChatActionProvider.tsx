import {ReactNode, useCallback} from "react";
import {ChatActionContext} from "@/context/ChatActionContext.ts";
import {useChatStateContext} from "@/hooks/useChatStateContext.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {MessageType} from "@/types";
import chatService from "@/services/chatService.ts";


interface ChatActionProviderProps {
  children: ReactNode
}

export function ChatActionProvider({ children }: ChatActionProviderProps) {
  const {currentUser} = useAuthContext()
  const {activeChat, saveChat, isNotExist} = useChatContext()
  const {
    messages,
    lastMessage,
    setLastReadMessage,
    rawUnreadCount,
    setReadCount,
    hasMorePrev,
    setHasMorePrev,
    addMessages
  } = useChatStateContext()


  const jumpToLatestMessage = useCallback(async () => {
    const chatId = activeChat?.id;
    const userId = currentUser?.uid;
    if (!chatId || !userId || !lastMessage) {
      return;
    }
    setReadCount(rawUnreadCount);
    await chatService.updateLastReadMessage({
      chatId, userId,
      messageId: lastMessage?.id
    })
    await chatService.updateUnreadCount({
      chatId, userId,
      value: 0
    })
    setReadCount(0);
  }, [activeChat, currentUser, lastMessage, setReadCount, rawUnreadCount]);


  const markRead = useCallback((message: MessageType) => {
    setLastReadMessage(prevMessage => {
      const prevMessageTime = prevMessage?.date.toDate().getTime() || 0;
      const MessageTime = message.date.toDate().getTime();
      if (MessageTime > prevMessageTime) {
        return message
      }
      return prevMessage
    })
    if (message.senderId !== currentUser?.uid && activeChat?.id) {
      setReadCount(prev => prev + 1);
    }
  }, [activeChat, setLastReadMessage, setReadCount, currentUser]);


  const sendMessage = useCallback(async (text: string) => {
    if (!activeChat || !currentUser || text === "") {
      return;
    }
    let newChat;
    if (isNotExist) {
      newChat = await saveChat();
    }
    await chatService.sendMessage({
      chatId: newChat?.id || activeChat.id,
      userId: currentUser.uid,
      message: text
    });
  }, [activeChat, currentUser, isNotExist]);


  const loadPrev = useCallback(async () => {
    if (!activeChat?.id || !messages.length || !hasMorePrev) {
      return false;
    }
    const response = await chatService.getPrevMessages({
      chatId: activeChat?.id,
      messageId: messages[0].id,
    });
    if (response) {
      addMessages(response)
    }
    setHasMorePrev(!!response);
    return !!response;
  }, [activeChat, messages]);


  return (
    <ChatActionContext.Provider value={{
      loadPrev,
      jumpToLatestMessage,
      markRead,
      sendMessage,
    }}>
      {children}
    </ChatActionContext.Provider>
  );
}