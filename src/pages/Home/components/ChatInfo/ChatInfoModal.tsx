import { useActiveChatStore } from "@/store";
import { ChatPreview } from "@/pages/Home/components/ChatInfo/components/ChatPreview";
import { ChatInfoItem } from "./components/ChatInfoItem";
import { Modal, ModalHeader } from "@/components/UI/Modal";
import classes from "./ChatInfoModal.module.scss";

interface ChatInfoProps {
  open: boolean;
  onClose: () => void;
}

export function ChatInfoModal({ open, onClose }: ChatInfoProps) {
  const activeChat = useActiveChatStore.use.chat();

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
            title={activeChat.title}
            // lastOnline={user?.lastOnline}
            // isOnline={user?.isOnline}
          />
        </div>
        <div className={classes.panel}>
          <div className={classes.info}>
            {!!activeChat.username && (
              <ChatInfoItem
                title={"@" + activeChat.username}
                subtitle="Имя пользователя"
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
