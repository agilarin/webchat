import { LoadingProgress } from "@/components/UI/LoadingProgress";
import classes from "./MessageList.module.scss";

export function MessageListSkeleton() {
  return (
    <div className={classes.root}>
      <div className={classes.progressContainer}>
        <div className={classes.progress}>
          <LoadingProgress />
        </div>
      </div>
    </div>
  );
}
