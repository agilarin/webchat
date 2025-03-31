import React, {useEffect, useRef, useState} from "react";
import {useChatActionContext} from "@/hooks/useChatActionContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {Button} from "@/components/UI/Button";
import classes from "./ChatFooter.module.scss";
import PaperPlaneIcon from "@/assets/icons/paper-plane.svg?react";



export function ChatFooter() {
  const {activeChat} = useChatContext();
  const {sendMessage} = useChatActionContext();
  const [messageValue, setMessageValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    setMessageValue("");
  }, [activeChat?.id]);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageValue]);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formatedMessageValue = messageValue.replace(/(\r\n|\r|\n)/g, "<br/>");
    sendMessage(formatedMessageValue);
    setMessageValue("");
  }


  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessageValue(event.target.value);
  }


  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if(event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  }


  return (
    <form
      ref={formRef}
      className={classes.root}
      onSubmit={handleSubmit}
    >

      <label className={classes.inputLabel}>
        <textarea
          ref={textareaRef}
          className={classes.input}
          placeholder="Написать сообщение..."
          value={messageValue}
          onChange={handleChange}
          rows={1}
          onKeyDown={handleKeyDown}
        />
      </label>

      <Button
        icon
        color="primary"
        variant="text"
        className={classes.sendButton}
        type="submit"
      >
        <PaperPlaneIcon className={classes.sendButtonIcon}/>
      </Button>

    </form>
  );
}