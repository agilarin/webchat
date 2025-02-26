import {useChatContext} from "@/hooks/useChatContext.ts";
import {ChatHeader} from "@/pages/Home/components/Chat/components/ChatHeader";
import {ChatFooter} from "@/pages/Home/components/Chat/components/ChatFooter";
import {MessageList} from "@/pages/Home/components/Chat/components/MessageList";
import classes from "./Chat.module.scss";


export function Chat() {
  const {currentChat} = useChatContext();

  return (
    <div className={classes.root}>
      {!!currentChat && (
        <div className={classes.chat}>
          <ChatHeader/>
          <MessageList/>
          <ChatFooter/>
        </div>
      )}
    </div>
  );
}