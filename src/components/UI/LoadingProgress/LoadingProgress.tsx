import classes from "./LoadingProgress.module.scss";


export function LoadingProgress() {
  return (
    <div className={classes.root}>
      <span className={classes.progress}>
        <svg className={classes.svg} viewBox="22 22 44 44" xmlns="http://www.w3.org/2000/svg">
          <circle className={classes.circle} cx="44" cy="44" r="20" fill="none" strokeWidth="3.6"/>
        </svg>
      </span>
    </div>
  );
}