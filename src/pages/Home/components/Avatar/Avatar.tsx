import classes from "./Avatar.module.scss";


interface AvatarProps {
  isOnline?: boolean,
  image?: string,
  title: string,
}

function Avatar({isOnline, image, title}: AvatarProps) {

  return (
    <div className={classes.root}>
      {image ? (
        <img className={classes.avatar} src={image} alt={title}/>
      ) : (
        <div className={classes.placeholder}>
          {title?.[0]?.toUpperCase()}
        </div>
      )}
      {isOnline && (
        <div className={classes.notify}/>
      )}
    </div>
  );
}

export default Avatar;