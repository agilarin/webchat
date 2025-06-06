import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {Avatar} from "@/pages/Home/components/Avatar";
import {UserAccountMenu} from "@/pages/Home/components/UserAccountMenu";
import classes from "./UserAccount.module.scss";


export function UserAccount() {
  const {userInfo} = useAuthContext();
  const fullName = [userInfo?.firstName, userInfo?.lastName].join(' ');

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Avatar title={fullName}/>

        <div className={classes.info}>
          <h4 className={classes.title}>
            {fullName}
          </h4>
          <p className={classes.subtitle}>
            {userInfo?.username && "@" + userInfo?.username}
          </p>
        </div>
      </div>

      <div className={classes.navigation}>
        <UserAccountMenu/>
      </div>
    </div>
  );
}