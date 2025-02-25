import {ReactNode} from "react";
import {ChatInfoContext} from "@/context/ChatInfoContext.ts";
import useToggle from "@/hooks/useToggle.ts";



interface InfoPanelProviderProps {
  children: ReactNode
}

function ChatInfoProvider({ children }: InfoPanelProviderProps) {
  const [open, toggle] = useToggle(true)


  return (
    <ChatInfoContext.Provider value={{open, toggle}}>
      {children}
    </ChatInfoContext.Provider>
  );
}

export default ChatInfoProvider;