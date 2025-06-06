import {useRef} from "react";
import clsx from "clsx";
import {CircleUser, EllipsisVertical, LogOut} from "lucide-react";
import authService from "@/services/authService.ts";
import {useToggle} from "@/hooks/useToggle.ts";
import {Button} from "@/components/UI/Button";
import {Menu, MenuItem} from "@/components/UI/Menu";
import {Account} from "@/components/Account";
import classes from "./UserAccountMenu.module.scss";


export function UserAccountMenu() {
  const [menuOpen, menuToggle] = useToggle(false);
  const [profileOpen, profileToggle] = useToggle(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={buttonRef}
        icon={true}
        shape="round"
        onClick={() => menuToggle()}
      >
        <EllipsisVertical size={26} strokeWidth={2} />
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
    </>
  );
}