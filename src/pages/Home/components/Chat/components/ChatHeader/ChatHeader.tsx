import {useToggle} from "@/hooks/useToggle.ts";
import {Avatar} from "@/pages/Home/components/Avatar";
import {useChatContext} from "@/hooks/useChatContext";
import {formatLastOnlineDate} from "@/utils/formatDate.ts";
import {Button} from "@/components/UI/Button";
import {ChatInfo} from "@/pages/Home/components/ChatInfo";
import classes from "./ChatHeader.module.scss";


export function ChatHeader() {
  const {activeChat} = useChatContext();
  const [open, toggle] = useToggle(false)
  const user = activeChat?.user;
  const userLastOnline = user?.lastOnline && formatLastOnlineDate(user?.lastOnline);
  const title =  activeChat?.title || [activeChat?.user?.firstName, activeChat?.user?.lastName].join(" ");
  let subTitle;
  if (activeChat?.type === "PRIVATE") {
    subTitle = user?.isOnline && "в сети" || userLastOnline
  } else {
    subTitle = activeChat?.members.length + " участников"
  }

  return (
    <div className={classes.headerRoot}>
      <Button
        className={classes.content}
        onClick={() => toggle()}
      >
        <Avatar
          image={user?.avatar}
          title={title}
        />

        <div className={classes.info}>
          <h4 className={classes.name}>
            {title}
          </h4>
          <p className={classes.userStatus}>
            {subTitle}
          </p>
        </div>
      </Button>

      <ChatInfo
        open={open}
        onClose={toggle}
      />
    </div>
  );
}