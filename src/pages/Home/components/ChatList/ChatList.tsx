import { PropsWithChildren } from "react";
import clsx from "clsx";
import classes from "./ChatList.module.scss";

export function ChatList({ children }: PropsWithChildren) {
  return (
    <ul className={clsx([classes.chatListRoot, classes.showScrollOnHover])}>
      {children}
    </ul>
  );
}
