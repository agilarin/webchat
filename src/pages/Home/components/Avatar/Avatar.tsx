import clsx from "clsx";
import classes from "./Avatar.module.scss";


interface AvatarProps {
  image?: string,
  title: string,
  className?: string,
  placeholderClassName?: string,
}

export function Avatar({image, title, className, placeholderClassName}: AvatarProps) {
  return (
    <div className={clsx(classes.avatarRoot, className)}>
      {image ? (
        <img className={classes.img} src={image} alt={title}/>
      ) : (
        <div className={clsx(classes.placeholder, placeholderClassName)}>
          {title?.[0]?.toUpperCase()}
        </div>
      )}
    </div>
  );
}

