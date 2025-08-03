import { ArrowLeft } from "lucide-react";
import { useActiveChatStore, useMessagesStore } from "@/store";
import { Avatar } from "@/pages/Home/components/Avatar";
import { Button } from "@/components/UI/Button";
import { ChatMenu } from "@/pages/Home/components/ChatRoom/components/ChatMenu";
import classes from "./ChatHeader.module.scss";
import { useChatInfoContext } from "@/contexts/ChatInfoContext";

export function ChatHeader() {
  const activeChat = useActiveChatStore.use.chat();
  const closeChat = useActiveChatStore.use.reset();
  const clearMessage = useMessagesStore.use.reset();
  const { toggle } = useChatInfoContext();

  const peer = activeChat?.peer;
  const subTitle = "";

  return (
    <div className={classes.headerRoot}>
      <div className={classes.left}>
        <Button
          icon
          shape="round"
          className={classes.buttonBack}
          onClick={() => {
            closeChat();
            clearMessage();
          }}
        >
          <ArrowLeft size={28} />
        </Button>

        <Button
          className={classes.content}
          onClick={() => toggle()}
        >
          <Avatar
            image={peer?.avatar}
            title={activeChat?.title}
          />

          <div className={classes.info}>
            <h4 className={classes.name}>{activeChat?.title}</h4>
            <p className={classes.userStatus}>{subTitle}</p>
          </div>
        </Button>
      </div>

      <ChatMenu />
    </div>
  );
}
