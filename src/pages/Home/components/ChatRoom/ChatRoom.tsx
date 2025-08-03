import clsx from "clsx";
import { useHotkeys } from "react-hotkeys-hook";

import { useActiveChatStore, useMessagesStore } from "@/store";
import { ChatHeader } from "./components/ChatHeader";
import { ChatFooter } from "./components/ChatFooter";
import { MessageList } from "./components/MessageList";
import { ChatMessagesListener } from "./components/ChatMessagesListener";
import { ChatInfoProvider } from "../ChatInfo";
import classes from "./ChatRoom.module.scss";

export function ChatRoom() {
  const activeChat = useActiveChatStore.use.chat();
  const closeChat = useActiveChatStore.use.reset();
  const clearMessage = useMessagesStore.use.reset();

  useHotkeys(
    "esc",
    () => {
      closeChat();
      clearMessage();
    },
    [closeChat]
  );

  return (
    <div className={clsx(classes.chatRoot, activeChat && classes.open)}>
      <div className={classes.chatBackground}>
        {!!activeChat && (
          <ChatInfoProvider>
            <ChatMessagesListener />
            <div className={classes.chat}>
              <ChatHeader />
              <MessageList />
              <ChatFooter />
            </div>
          </ChatInfoProvider>
        )}
      </div>
    </div>
  );
}
