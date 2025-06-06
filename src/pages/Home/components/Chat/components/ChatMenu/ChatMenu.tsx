import {useRef} from "react";
import {EllipsisVertical, Info} from "lucide-react";
import {useToggle} from "@/hooks/useToggle.ts";
import {Button} from "@/components/UI/Button";
import {Menu, MenuItem} from "@/components/UI/Menu";
import {ChatInfo} from "@/pages/Home/components/ChatInfo";
import classes from "./ChatMenu.module.scss";


export function ChatMenu() {
  const [menuOpen, menuToggle] = useToggle(false);
  const [chatInfoOpen, chatInfoToggle] = useToggle(false);
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
        <MenuItem className={classes.item}>
          <Info
            size={20}
            className={classes.itemIcon}
          />
          Описание
        </MenuItem>
      </Menu>

      <ChatInfo
        open={chatInfoOpen}
        onClose={chatInfoToggle}
      />
    </>
  );
}