import {createContext} from "react";


interface ChatInfoContextType {
  open: boolean,
  toggle: (state?: boolean) => void,
}

export const ChatInfoContext = createContext<ChatInfoContextType>({
  open: false,
  toggle: () => {}
});