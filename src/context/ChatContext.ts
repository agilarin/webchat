import {createContext, Dispatch, SetStateAction, MutableRefObject} from "react";
import {ChatType, MessageType} from "@/types";


interface ChatContextType {
  currentChat: ChatType | null,
  setCurrentChat: Dispatch<SetStateAction<ChatType | null>>,
  isNotExist: MutableRefObject<boolean>,

  messages: MessageType[],
  messagesIsSuccess: boolean,
  loadPrev: () => Promise<boolean>
  jumpToLatestMessage: () => void,

  markRead: (message: MessageType) => void,
  setLastMessage: Dispatch<SetStateAction<MessageType | null>>,

  unreadCount: number,
  setUnreadCount: Dispatch<SetStateAction<number>>,
}

export const ChatContext = createContext<ChatContextType>({
  currentChat: null,
  setCurrentChat: () => {},
  isNotExist: { current: false },

  messages: [],
  messagesIsSuccess: false,
  loadPrev: () => Promise.resolve(true),
  jumpToLatestMessage: () => {},

  markRead: () => {},
  setLastMessage: () => {},

  unreadCount: 0,
  setUnreadCount: () => {},
})