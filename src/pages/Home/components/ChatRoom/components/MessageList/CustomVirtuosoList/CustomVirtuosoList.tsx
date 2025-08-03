import { forwardRef } from "react";
import { ListProps } from "react-virtuoso";
import classes from "./CustomVirtuosoList.module.scss";

export const CustomVirtuosoList = forwardRef<HTMLDivElement, ListProps>(
  (Props, listRef) => (
    <div
      {...Props}
      ref={listRef}
      className={classes.customVirtuosoList}
    />
  )
);
