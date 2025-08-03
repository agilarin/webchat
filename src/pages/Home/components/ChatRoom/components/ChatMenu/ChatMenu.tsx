import { useRef } from "react";
import { EllipsisVertical, Info } from "lucide-react";

import { useChatInfoContext } from "@/contexts/ChatInfoContext";
import { useToggle } from "@/hooks/useToggle.ts";
import { Button } from "@/components/UI/Button";
import { Menu, MenuItem } from "@/components/UI/Menu";
import classes from "./ChatMenu.module.scss";

export function ChatMenu() {
  const { toggle } = useChatInfoContext();
  const [menuOpen, menuToggle] = useToggle(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createHandleClickItem = (callback: () => void) => {
    return () => {
      menuToggle(false);
      callback();
    };
  };

  return (
    <>
      <Button
        ref={buttonRef}
        icon={true}
        shape="round"
        onClick={() => menuToggle()}
      >
        <EllipsisVertical
          size={26}
          strokeWidth={2}
        />
      </Button>

      <Menu
        open={menuOpen}
        onClose={() => menuToggle(false)}
        toggleEl={buttonRef.current}
      >
        <MenuItem
          className={classes.item}
          onClick={createHandleClickItem(() => toggle())}
        >
          <Info
            size={20}
            className={classes.itemIcon}
          />
          Описание
        </MenuItem>
      </Menu>
    </>
  );
}
