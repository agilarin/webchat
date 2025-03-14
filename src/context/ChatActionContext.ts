import {createContext} from "react";
import {MessageType} from "@/types";


interface ChatActionContextType {
  loadPrev: () => Promise<boolean>
  jumpToLatestMessage: () => void,

  markRead: (message: MessageType) => void,
  sendMessage: (text: string) => void,
}

export const ChatActionContext = createContext<ChatActionContextType>({
  loadPrev: () => Promise.resolve(true),
  jumpToLatestMessage: () => {},
  markRead: () => {},
  sendMessage: () => {},
})