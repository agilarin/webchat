import {createContext, Dispatch, SetStateAction, MutableRefObject} from "react";
import {ChatType, MessageType} from "@/types";


interface IChatContext {
  currentChat: ChatType | null,
  setCurrentChat:  Dispatch<SetStateAction<ChatType | null>>,
  isCreated: MutableRefObject<boolean>,

  messages: MessageType[],
  messagesIsFetching: boolean,
  getPrevMessages: () => Promise<boolean>
  goToLastMessage: () => void,

  lastReadMessage: MessageType | null,
  setLastReadMessage: Dispatch<SetStateAction<MessageType | null>>,
  lastReadMessageIsFetching: boolean,

  setLastMessage: Dispatch<SetStateAction<MessageType | null>>,

  unreadCount: number,
  setUnreadCount: Dispatch<SetStateAction<number>>,
  incrementUnreadCount: (value: number) => void,
}


export const ChatContext = createContext<IChatContext>({
  currentChat: null,
  setCurrentChat: () => {},
  isCreated: { current: false },

  messages: [],
  messagesIsFetching: false,
  getPrevMessages: () => Promise.resolve(true),
  goToLastMessage: () => {},

  lastReadMessage:  null,
  setLastReadMessage: () => {},
  lastReadMessageIsFetching: false,

  setLastMessage: () => {},

  unreadCount: 0,
  setUnreadCount: () => {},
  incrementUnreadCount: () => {},
})