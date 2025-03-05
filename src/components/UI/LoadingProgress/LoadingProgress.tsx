import clsx from "clsx";
import classes from "./LoadingProgress.module.scss";


interface LoadingProgressProps {
  color?: "default" | "white";
}

export function LoadingProgress({ color = "default" }: LoadingProgressProps) {
  return (
    <div className={classes.root}>
      <span className={clsx(classes.progress, classes[color + "ColorProgress"])}>
        <svg className={classes.svg} viewBox="22 22 44 44" xmlns="http://www.w3.org/2000/svg">
          <circle className={classes.circle} cx="44" cy="44" r="20" fill="none" strokeWidth="3.6"/>
        </svg>
      </span>
    </div>
  );
}