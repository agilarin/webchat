import { PropsWithChildren } from "react";
import { useToggle } from "@/hooks/useToggle";
import { ChatInfoContext } from "@/contexts/ChatInfoContext";
import { ChatInfoModal } from "./ChatInfoModal";

export function ChatInfoProvider({ children }: PropsWithChildren) {
  const [open, toggle] = useToggle(false);

  return (
    <ChatInfoContext.Provider value={{ open, toggle }}>
      {children}
      <ChatInfoModal
        open={open}
        onClose={toggle}
      />
    </ChatInfoContext.Provider>
  );
}
