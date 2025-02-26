import {MouseEvent, ReactNode} from "react";
import clsx from "clsx";
import classes from "./Menu.module.scss";


interface MenuItemProps {
  onClick?: (event: MouseEvent<HTMLLIElement>) => void,
  children?: ReactNode,
  className?: string,
}

export function MenuItem({ onClick, children, className }: MenuItemProps) {
  return (
    <li
      className={clsx(classes.item, className)}
      onClick={onClick}
    >
      {children}
    </li>
  );
}