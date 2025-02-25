import classes from "./ChatInfoItem.module.scss";



interface ChatInfoItemProps {
  title: string,
  subtitle: string
}

function ChatInfoItem({ title, subtitle }: ChatInfoItemProps) {
  return (
    <div className={classes.itemRoot}>
      <p className={classes.title}>
        {title}
      </p>
      <p className={classes.subtitle}>
        {subtitle}
      </p>
    </div>
  );
}

export default ChatInfoItem;