import clsx from "clsx";
import { ChatItemSkeleton } from "./ChatItem";
import classes from "./ChatList.module.scss";

export function ChatListSkeleton() {
  return (
    <ul className={clsx(classes.chatListRoot, "not-scroll")}>
      {Array(20)
        .fill(0)
        .map((_, i) => (
          <ChatItemSkeleton key={i} />
        ))}
    </ul>
  );
}
