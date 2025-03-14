import {ReactNode, SetStateAction, useCallback, useEffect, useState} from "react";
import { Unsubscribe } from "firebase/firestore";
import {ChatType, MessageType} from "@/types";
import {UserChatsContext} from "@/context/UserChatsContext.ts";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import userChatsService from "@/services/userChatsService.ts";


export type LastMessagesType = {[key: string]: MessageType | null };
export type CountsType = {[key: string]: number };
export type SetReadCount = (chatId: string, value: SetStateAction<number>) => void;
export type UserChatsItemsProps = {
  chat: ChatType,
  lastMessage: MessageType | null,
  unreadCount: number,
};

interface ChatListProviderProps {
  children: ReactNode
}

export function UserChatsProvider({ children }: ChatListProviderProps) {
  const {currentUser} = useAuthContext()
  const [isSuccess, setIsSuccess] = useState(false);
  const [chats, setChats] = useState<ChatType[]>([]);
  const [chatsId, setChatsId] = useState<string[]>([]);
  const [items, setItems] = useState<UserChatsItemsProps[]>([]);
  const [lastMessages, setLastMessages] = useState<LastMessagesType>({});
  const [unreadCounts, setUnreadCounts] = useState<CountsType>({});
  const [readCounts, setReadCounts] = useState<CountsType>({});


  useEffect(() => {
    const userId = currentUser?.uid;
    if (!userId) {
      return;
    }
    const unsub = userChatsService.subscribeToUserChats(userId, (ids) => {
      const promises = ids.map(chatId => chatService.getChat({ chatId, userId }))
      Promise.all(promises).then((chats) => {
        setChats(chats);
        setChatsId(chats.map(item => item.id))
        setIsSuccess(true)
    })
    });
    return () => unsub();
  }, [currentUser]);


  useEffect(() => {
    if (!chatsId.length || !currentUser) {
      return;
    }
    setLastMessages({});
    setUnreadCounts({});
    const unsubArray: Unsubscribe[] = []
    chatsId.map(chatId => {
      const unsubMessage = chatService.subscribeToLastMessage(chatId,
        (message) => {
          setLastMessages(prev => ({
            ...prev,
            [chatId]: message
          }))
        })
      const unsubCount = chatService.subscribeToUnreadCount({ chatId, userId: currentUser.uid },
        (count) => {
          setUnreadCounts(prev => ({
            ...prev,
            [chatId]: count
          }))
        })
      unsubArray.push(unsubMessage, unsubCount)
    })
    return () => unsubArray.forEach(unsub => unsub())
  }, [chatsId])


  useEffect(() => {
    if (!chats.length || !isSuccess) {
      return
    }
    const newItems: UserChatsItemsProps[] = [];
    chats.map(chat => {
      const CountsSum = unreadCounts[chat.id] - (readCounts[chat.id] || 0);
      newItems.push({
        chat,
        lastMessage: lastMessages[chat.id],
        unreadCount: CountsSum < 0 ? 0 : CountsSum,
      });
    })
    newItems.sort((itemA, itemB) => {
      const itemATime = itemA.lastMessage?.date.toDate().getTime() || 0;
      const itemBTime = itemB.lastMessage?.date.toDate().getTime() || 0;
      return itemBTime - itemATime;
    })
    if (JSON.stringify(newItems) !== JSON.stringify(items)) {
      setItems(newItems);
    }
  }, [chats, lastMessages, unreadCounts, readCounts]);


  const setReadCount = useCallback((chatId: string, value: SetStateAction<number>) => {
    const isFunc = typeof value === "function"
    setReadCounts(prev => ({
      ...prev,
      [chatId]: isFunc ? value(prev[chatId]) : value
    }))
  }, [setReadCounts])


  return (
    <UserChatsContext.Provider value={{
      chats,
      items,
      isSuccess,
      setReadCount,
      lastMessages,
      unreadCounts,
      readCounts,
      setChats,
    }}>
      {children}
    </UserChatsContext.Provider>
  );
}