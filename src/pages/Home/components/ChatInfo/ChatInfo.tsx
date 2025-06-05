import {useChatContext} from "@/hooks/useChatContext.ts";
import {ChatPreview} from "@/pages/Home/components/ChatInfo/components/ChatPreview";
import {ChatInfoItem} from "./components/ChatInfoItem";
import {Modal, ModalHeader} from "@/components/UI/Modal";
import classes from "./ChatInfo.module.scss";

interface ChatInfoProps {
  open: boolean;
  onClose: () => void;
}

export function ChatInfo({ open, onClose }: ChatInfoProps) {
  const {activeChat} = useChatContext();
  const user = activeChat?.user;
  const title = activeChat?.title || [user?.firstName, user?.lastName].join(" ")
  const username = activeChat?.username || user?.username;

  if (!activeChat || !open) {
    return;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <ModalHeader
        title="Информация"
        onClose={onClose}
      />

      <div className={classes.root}>
        <div className={classes.panel}>
          <ChatPreview
            title={title}
            lastOnline={user?.lastOnline}
            isOnline={user?.isOnline}
          />
        </div>
        <div className={classes.panel}>
          <div className={classes.info}>
            {!!username && (
              <ChatInfoItem
                title={"@" + username}
                subtitle="Имя пользователя"
              />
            )}
          </div>
        </div>
      </div>

    </Modal>
  );
}