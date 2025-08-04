import classes from "./UserSearchList.module.scss";

export function UserSearchListEmpty() {
  return (
    <div className={classes.SearchListRoot}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>Результаты поиска</span>
      </div>
      <div className={classes.notFound}>
        <span className={classes.notFoundTitle}>Нет результатов</span>
      </div>
    </div>
  );
}
