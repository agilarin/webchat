import {Avatar} from "@/pages/Home/components/Avatar";
import {useChatContext} from "@/hooks/useChatContext";
import {useChatInfoContext} from "@/hooks/useChatInfoContext";
import {formatLastOnlineDate} from "@/utils/formatDate.ts";
import {Button} from "@/components/UI/Button";
import classes from "./ChatHeader.module.scss";



export function ChatHeader() {
  const {currentChat} = useChatContext();
  const {toggle} = useChatInfoContext()
  const user = currentChat?.user;
  const userLastOnline = user?.lastOnline && formatLastOnlineDate(user?.lastOnline);
  const title =  currentChat?.title || [currentChat?.user?.firstName, currentChat?.user?.lastName].join(" ");
  let subTitle;
  if (currentChat?.type === "PRIVATE") {
    subTitle = user?.isOnline && "в сети" || userLastOnline
  } else {
    subTitle = currentChat?.members.length + " участников"
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
    </div>
  );
}