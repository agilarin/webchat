import {ReactNode, useState, useCallback} from "react";
import {ChatType} from "@/types";
import {Timestamp} from "firebase/firestore";
import {ChatContext} from "@/context/ChatContext.ts";
import {generateUniqueId} from "@/utils/generateUniqueId.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import chatService from "@/services/chatService.ts";

interface ChatProviderProps {
  children: ReactNode,
}

export function ChatProvider({ children }: ChatProviderProps) {
  const {currentUser} = useAuthContext();
  const [activeChat, setActiveChat] = useState<ChatType | null>(null);
  const [isNotExist, setIsNotExist] = useState(false);

  const createChat = useCallback(
    ({type, user}: Required<Pick<ChatType, "type" | "user">>) => {
      if  (!currentUser) {
        return
      }
      setActiveChat({
        id: generateUniqueId(),
        type: type,
        createdAt: Timestamp.fromDate(new Date()),
        members: [currentUser.uid, user.id],
        user: user,
      });
      setIsNotExist(true);
    },
    [setActiveChat, setIsNotExist, currentUser]);

  const watchChat = useCallback((chat: ChatType) => {
    setActiveChat(chat);
    setIsNotExist(false);
  }, [setActiveChat, setIsNotExist]);

  const closeChat = useCallback(() => {
    setActiveChat(null);
    setIsNotExist(false);
  }, [setActiveChat, setIsNotExist]);

  const saveChat = useCallback(async () => {
    if (!activeChat || isNotExist || !currentUser) {
      return;
    }
    const chat = await chatService.createChat({
      data: activeChat,
      userId: currentUser.uid
    });
    setActiveChat(chat);
    setIsNotExist(false)
    return chat;
  }, [setActiveChat, setIsNotExist, currentUser]);

  return (
    <ChatContext.Provider value={{
      activeChat,
      isNotExist,
      watchChat,
      createChat,
      saveChat,
      closeChat
    }}>
      {children}
    </ChatContext.Provider>
  );
}