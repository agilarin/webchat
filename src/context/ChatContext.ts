import {createContext} from "react";
import {ChatType} from "@/types";


interface ChatContextType {
  activeChat: ChatType | null,
  isNotExist: boolean,
  watchChat: (chat: ChatType) => void,
  createChat: (data: Required<Pick<ChatType, "type" | "user">>) => void,
  saveChat: () => Promise<ChatType | undefined>,
}

export const ChatContext = createContext<ChatContextType>({
  activeChat: null,
  isNotExist: false,
  watchChat: () => {},
  createChat: () => {},
  saveChat: () => Promise.resolve(undefined),
})