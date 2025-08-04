import { ChatListSkeleton } from "@/pages/Home/components/ChatList";
import classes from "./UserSearchList.module.scss";

export function UserSearchListSkeleton() {
  return (
    <div className={classes.SearchListRoot}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>Загрузка...</span>
      </div>
      <ChatListSkeleton />
    </div>
  );
}
