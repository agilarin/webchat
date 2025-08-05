import clsx from "clsx";
import { useToggle } from "@/hooks/useToggle.ts";
import { useCurrentUser } from "@/hooks/store/useCurrentUser";
import { Modal, ModalHeader } from "@/components/UI/Modal";
import { AccountItem } from "./components/AccountItem";
import { EditPassword } from "./components/EditPassword";
import { Avatar } from "@/components/Avatar";
import { EditName } from "./components/EditName";
import { EditEmail } from "./components/EditEmail";
import { EditUsername } from "./components/EditUsername";
import classes from "./Account.module.scss";
import { getFullName } from "@/utils/getFullName";

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

export function Account({ open, onClose }: UserProfileProps) {
  const user = useCurrentUser();

  const [nameOpen, nameToggle] = useToggle(false);
  const [emailOpen, emailToggle] = useToggle(false);
  const [usernameOpen, usernameToggle] = useToggle(false);
  const [passwordOpen, passwordToggle] = useToggle(false);
  const fullName = getFullName(user);

  const modals = [
    { isOpen: nameOpen, toggle: nameToggle, Component: EditName },
    { isOpen: emailOpen, toggle: emailToggle, Component: EditEmail },
    { isOpen: usernameOpen, toggle: usernameToggle, Component: EditUsername },
    { isOpen: passwordOpen, toggle: passwordToggle, Component: EditPassword },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <ModalHeader
        title="Аккаунт"
        onClose={onClose}
      />

      <div className={classes.accountRoot}>
        <div className={clsx(classes.section, classes.sectionAvatar)}>
          <Avatar
            className={classes.avatar}
            placeholderClassName={classes.avatarPlaceholder}
            title={fullName}
          />
          <h4 className={classes.name}>{fullName}</h4>
        </div>

        <div className={classes.section}>
          <AccountItem
            title="Имя"
            value={fullName}
            onClick={() => nameToggle(true)}
          />
          <AccountItem
            title="Электронная почта"
            value={user?.email}
            onClick={() => emailToggle(true)}
          />
          <AccountItem
            title="Имя пользователя"
            value={user?.username}
            onClick={() => usernameToggle(true)}
          />
        </div>

        <div className={classes.section}>
          <AccountItem
            title="Пароль"
            value="Изменить"
            onClick={() => passwordToggle(true)}
          />
        </div>

        {modals.map(
          ({ isOpen, toggle, Component }, i) =>
            isOpen && (
              <Component
                key={i}
                open={isOpen}
                onClose={() => toggle(false)}
              />
            )
        )}
      </div>
    </Modal>
  );
}
