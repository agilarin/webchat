import {createContext, Dispatch, SetStateAction} from "react";
import {MessageType} from "@/types";


interface ChannelContextType {
  messages: MessageType[],
  messagesIsSuccess: boolean,
  addMessages: (message: MessageType[]) => void,
  hasMorePrev: boolean,
  setHasMorePrev: Dispatch<SetStateAction<boolean>>,
  rawUnreadCount: number,
  readCount: number,
  unreadCount: number,
  lastMessage: MessageType | null,

  setLastReadMessage: Dispatch<SetStateAction<MessageType | null>>,
  setReadCount: Dispatch<SetStateAction<number>>,
}

export const ChatStateContext = createContext<ChannelContextType>({
  messages: [],
  messagesIsSuccess: false,
  addMessages: () => {},
  hasMorePrev: false,
  setHasMorePrev: () => {},
  lastMessage: null,
  rawUnreadCount: 0,
  readCount: 0,
  unreadCount: 0,
  setLastReadMessage: () => {},
  setReadCount: () => {},

})