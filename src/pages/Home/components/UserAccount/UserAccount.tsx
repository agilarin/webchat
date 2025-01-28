import authService from "@/services/authService.ts";
import {Avatar} from "@/pages/Home/components/Avatar";
import {Button} from "@/components/UI/Button";
import classes from "./UserAccount.module.scss";
import LogoutIcon from "@/assets/icons/logout.svg?react";
import {UserType} from "@/types";
import {useLayoutEffect, useState} from "react";
import userService from "@/services/userService.ts";
import {useAuthState} from "@/hooks/useAuthState.ts";


function UserAccount() {
  const {currentUser} = useAuthState();
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const fullName = [userProfile?.firstName, userProfile?.lastName].join(' ');


  useLayoutEffect(() => {
    if (!currentUser) {
      return;
    }
    userService.getUser(currentUser.uid).then(setUserProfile)
  }, [currentUser]);


  const handleLogout = () => authService.signOut();


  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Avatar title={fullName}/>

        <div className={classes.info}>
          <h4 className={classes.title}>
            {fullName}
          </h4>
        </div>
      </div>

      <div className={classes.navigation}>
        <Button
          variant="text"
          color="gray"
          className={classes.button}
          onClick={handleLogout}
        >
          <LogoutIcon className={classes.logoutIcon}/>
        </Button>
      </div>

    </div>
  );
}

export default UserAccount;