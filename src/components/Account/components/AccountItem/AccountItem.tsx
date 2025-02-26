import React from "react";
import {Button} from "@/components/UI/Button";
import classes from "./AccountItem.module.scss";


interface AccountItemProps {
  title?: string,
  value?: string,
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export function AccountItem({ title, value, onClick }: AccountItemProps) {
  return (
    <Button
      className={classes.itemRoot}
      onClick={onClick}
    >
      <span className={classes.title}>
        {title}
      </span>
      <span className={classes.value}>
        {value}
      </span>
    </Button>
  );
}