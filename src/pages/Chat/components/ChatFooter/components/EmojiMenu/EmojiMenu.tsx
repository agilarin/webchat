import { useState } from "react";
import { SmilePlus } from "lucide-react";
import ru from "@emoji-mart/data/i18n/ru.json";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Button } from "@/components/UI/Button";
import classes from "./EmojiMenu.module.scss";

export type EmojiBase = {
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
};

interface EmojiMenuProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiMenu({ onEmojiSelect }: EmojiMenuProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  return (
    <>
      <Button
        icon
        className={classes.button}
        type="button"
        onClick={handleClick}
      >
        <SmilePlus size={26} />
      </Button>

      {open && (
        <div className={classes.menu}>
          <Picker
            data={data}
            i18n={ru}
            locale="ru"
            onEmojiSelect={(emoji: EmojiBase) => {
              onEmojiSelect(emoji.native);
            }}
          />
        </div>
      )}
    </>
  );
}
