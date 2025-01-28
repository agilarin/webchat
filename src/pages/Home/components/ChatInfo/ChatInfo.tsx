import {useChatState} from "@/hooks/useChatState.ts";
import {Avatar} from "@/pages/Home/components/Avatar";
import classes from "./ChatInfo.module.scss";
import {formatLastOnlineDate} from "@/utils/formatDate.ts";


function ChatInfo() {
  const {currentChat} = useChatState();
  const user = currentChat?.user;
  const title = currentChat?.title || [user?.firstName, user?.lastName].join(" ")
  const username = currentChat?.username || user?.username;
  const userLastOnline = user?.lastOnline && formatLastOnlineDate(user?.lastOnline);


  if (!currentChat) {
    return;
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <h3 className={classes.title}>
          Информация
        </h3>
      </div>

      <div className={classes.panel}>
        <div className={classes.mainInfo}>
          <Avatar title={title}/>
          <div className={classes.mainInfoContent}>
            <h4 className={classes.name}>
              {title}
            </h4>
            <span className={classes.status}>
            {userLastOnline}
          </span>
          </div>
        </div>
      </div>

      <div className={classes.panel}>
        <div className={classes.item}>
          <p className={classes.itemTitle}>
            {currentChat?.user?.email}
          </p>
          <p className={classes.itemSubtitle}>
            Электронная почта
          </p>
        </div>
        <div className={classes.item}>
          <p className={classes.itemTitle}>
            {username && "@" + username}
          </p>
          <p className={classes.itemSubtitle}>
            Имя пользователя
          </p>
        </div>
      </div>

      <div className={classes.panel}>
      </div>

      </div>
      );
      }

      export default ChatInfo;