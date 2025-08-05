import { useNavigate, useParams } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";

import { ROUTES } from "@/constants";
import { useResolveChatByUsername } from "./useResolveChatByUsername";
import { ChatHeader } from "./components/ChatHeader";
import { ChatFooter } from "./components/ChatFooter";
import { MessageList } from "./components/MessageList";
import { ChatMessagesListener } from "./components/ChatMessagesListener";
import { ChatInfoProvider } from "./components/ChatInfo";
import classes from "./Chat.module.scss";

type ChatParams = { username: string };

export function Chat() {
  const { username } = useParams() as ChatParams;
  const { activeChat, loading } = useResolveChatByUsername(username);
  const navigate = useNavigate();

  useHotkeys("esc", () => navigate(ROUTES.ROOT), []);

  if (loading) return null;
  if (!activeChat) return null;

  return (
    <ChatInfoProvider>
      <div className={classes.chatRoot}>
        <div className={classes.chat}>
          <ChatMessagesListener />
          <ChatHeader />
          <MessageList />
          <ChatFooter />
        </div>
      </div>
    </ChatInfoProvider>
  );
}
