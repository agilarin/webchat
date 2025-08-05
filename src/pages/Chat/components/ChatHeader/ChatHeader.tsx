import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { ROUTES } from "@/constants";
import { useChatInfoContext } from "@/contexts/ChatInfoContext";
import { useActiveChatStore } from "@/store";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/UI/Button";
import { ChatMenu } from "../ChatMenu";
import classes from "./ChatHeader.module.scss";

export function ChatHeader() {
  const activeChat = useActiveChatStore.use.chat();
  const navigate = useNavigate();
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
          onClick={() => navigate(ROUTES.ROOT)}
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
