import { memo } from "react";
import { Link } from "react-router";
import clsx from "clsx";
import Skeleton from "react-loading-skeleton";

import { formatDate } from "@/utils/formatDate.ts";
import { Avatar } from "@/components/Avatar";
import classes from "./ChatItem.module.scss";

export interface ChatItemProps {
  title: string;
  subtitle?: string;
  date?: Date;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  href: string;
}

export const ChatItem = memo(function ChatItem({
  title,
  subtitle,
  date,
  count,
  active,
  onClick,
  href,
}: ChatItemProps) {
  return (
    <li
      className={clsx(classes.root, classes.hover, active && classes.active)}
      onClick={onClick}
    >
      <Link
        to={href}
        className={classes.link}
      >
        <Avatar title={title} />

        <div className={classes.content}>
          <div className={classes.info}>
            <h4 className={classes.title}>{title}</h4>
            <p className={classes.subtitle}>
              {subtitle || <Skeleton width="100%" />}
            </p>
          </div>

          {!!(count || date) && (
            <div className={classes.dateAndCount}>
              {!!date && (
                <span className={classes.date}>{formatDate(date)}</span>
              )}
              {!!count && (
                <div className={classes.count}>
                  <span className={classes.countText}>{count}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
});
