import {Avatar} from "@/pages/Home/components/Avatar";
import classes from "./ChatPreview.module.scss";
import {formatLastOnlineDate} from "@/utils/formatDate.ts";


interface ChatPreviewProps {
  title: string,
  lastOnline?: number,
  isOnline?: boolean,
}

function ChatPreview({ title, lastOnline }: ChatPreviewProps) {
  const userLastOnline = lastOnline && formatLastOnlineDate(lastOnline);

  return (
    <div className={classes.ChatPreviewRoot}>
      <Avatar title={title}/>
      <div className={classes.content}>
        <h4 className={classes.title}>
          {title}
        </h4>
        <span className={classes.status}>
          {userLastOnline}
        </span>
      </div>
    </div>
  );
}

export default ChatPreview;