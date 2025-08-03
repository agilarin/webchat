import { createContext, useContext } from "react";

type ChatInfoContextValue = {
  open: boolean;
  toggle: (nextValue?: boolean) => void;
};

export const ChatInfoContext = createContext<ChatInfoContextValue>({
  open: false,
  toggle: () => {},
});

export const useChatInfoContext = () => useContext(ChatInfoContext);
