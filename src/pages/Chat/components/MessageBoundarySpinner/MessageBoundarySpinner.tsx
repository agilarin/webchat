import { LoadingProgress } from "@/components/UI/LoadingProgress";
import classes from "./MessageBoundarySpinner.module.scss";

export function MessageBoundarySpinner() {
  return (
    <div className={classes.spinnerRoot}>
      <div className={classes.spinnerWrapper}>
        <LoadingProgress />
      </div>
    </div>
  );
}
