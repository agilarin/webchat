import {useRef} from "react";
import clsx from "clsx";
import authService from "@/services/authService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {Button} from "@/components/UI/Button";
import {Menu, MenuItem} from "@/components/UI/Menu";
import {Avatar} from "@/pages/Home/components/Avatar";
import {Account} from "@/components/Account";
import { EllipsisVertical } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { CircleUser } from 'lucide-react';
import classes from "./UserAccount.module.scss";


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
          <EllipsisVertical size={26} strokeWidth={2.5} />
        </Button>

        <Menu
          open={menuOpen}
          onClose={() => menuToggle(false)}
          toggleEl={buttonRef.current}
        >
          <MenuItem className={classes.item} onClick={() => profileToggle(true)}>
            <CircleUser
              size={20}
              className={classes.itemIcon}
            />
            Мой аккаунт
          </MenuItem>

          <MenuItem
            className={clsx(classes.item, classes.itemRed)}
            onClick={() => authService.signOut()}
          >
            <LogOut
              size={20}
              className={classes.itemIcon}
            />
            Выйти
          </MenuItem>
        </Menu>
        <Account open={profileOpen} onClose={() => profileToggle(false)} />
      </div>

    </div>
  );
}