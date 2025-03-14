import {useRef} from "react";
import clsx from "clsx";
import authService from "@/services/authService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {Button} from "@/components/UI/Button";
import {Menu, MenuItem} from "@/components/UI/Menu";
import {Avatar} from "@/pages/Home/components/Avatar";
import {Account} from "@/components/Account";
import classes from "./UserAccount.module.scss";
import LogoutIcon from "@/assets/icons/logout.svg?react";
import EllipsisIcon from "@/assets/icons/ellipsis.svg?react";
import UserIcon from "@/assets/icons/user-avatar.svg?react";



export function UserAccount() {
  const {userInfo} = useAuthContext();
  const [menuOpen, menuToggle] = useToggle(false);
  const [profileOpen, profileToggle] = useToggle(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
        <Button
          ref={buttonRef}
          icon={true}
          shape="round"
          onClick={() => menuToggle()}
        >
          <EllipsisIcon/>
        </Button>

        <Menu
          open={menuOpen}
          onClose={() => menuToggle(false)}
          toggleEl={buttonRef.current}
        >
          <MenuItem className={classes.item} onClick={() => profileToggle(true)}>
            <UserIcon className={classes.itemIcon}/>
            Мой аккаунт
          </MenuItem>

          <MenuItem
            className={clsx(classes.item, classes.itemRed)}
            onClick={() => authService.signOut()}
          >
            <LogoutIcon className={classes.itemIcon}/>
            Выйти
          </MenuItem>
        </Menu>
        <Account open={profileOpen} onClose={() => profileToggle(false)} />
      </div>

    </div>
  );
}