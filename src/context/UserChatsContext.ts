import {createContext, Dispatch, SetStateAction} from "react";
import {ChatType} from "@/types";
import {UserChatsItemsProps, CountsType, LastMessagesType, SetReadCount} from "@/components/Providers/UserChatsProvider";


interface ChatListContextType {
  chats: ChatType[],
  setChats: Dispatch<SetStateAction<ChatType[]>>,
  items: UserChatsItemsProps[],
  isSuccess: boolean,
  lastMessages: LastMessagesType,
  unreadCounts: CountsType,
  readCounts: CountsType,
  setReadCount: SetReadCount,
}

export const UserChatsContext = createContext<ChatListContextType>({
  chats: [],
  isSuccess: false,
  setChats: () => {},
  items: [],
  lastMessages: {},
  unreadCounts: {},
  readCounts: {},
  setReadCount: () => {},
})