import { ChevronDown } from "lucide-react";
import { useActiveChatStore } from "@/store";
import { useUnreadCount } from "@/hooks/store/useUnreadCount";
import classes from "./JumpButton.module.scss";

interface ButtonJumpToEndProps {
  chatId?: string;
  onClick: () => void;
}

export function JumpButton({ onClick }: ButtonJumpToEndProps) {
  const activeChat = useActiveChatStore.use.chat();
  const unreadCount = useUnreadCount(activeChat?.id);

  return (
    <div className={classes.jumpButtonRoot}>
      <button
        className={classes.button}
        onClick={onClick}
      >
        <ChevronDown
          size={36}
          strokeWidth={1.5}
        />
        {unreadCount > 0 && (
          <span className={classes.notify}>{unreadCount}</span>
        )}
      </button>
    </div>
  );
}
