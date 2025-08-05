import {ComponentPropsWithoutRef, useEffect, useRef} from "react";
import classes from "./MessageInput.module.scss";

interface MessageInputProps extends ComponentPropsWithoutRef<"textarea"> {}

export function MessageInput({value, ...otherProps}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <label className={classes.inputLabel}>
        <textarea
          ref={textareaRef}
          className={classes.input}
          placeholder="Написать сообщение..."
          value={value}
          rows={1}
          {...otherProps}
        />
    </label>
  );
}