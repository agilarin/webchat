import { Avatar } from "@/components/Avatar";
import { UserAccountMenu } from "@/pages/Home/components/UserAccountMenu";
import { useCurrentUser } from "@/hooks/store/useCurrentUser";
import { getFullName } from "@/utils/getFullName";
import classes from "./UserAccount.module.scss";

export function UserAccount() {
  const user = useCurrentUser();
  const fullName = getFullName(user);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Avatar title={fullName} />

        <div className={classes.info}>
          <h4 className={classes.title}>{fullName}</h4>
          <p className={classes.subtitle}>
            {user?.username && "@" + user?.username}
          </p>
        </div>
      </div>

      <div className={classes.navigation}>
        <UserAccountMenu />
      </div>
    </div>
  );
}
