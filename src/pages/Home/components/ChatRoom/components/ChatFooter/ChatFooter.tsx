import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/UI/Button";
import { MessageInput } from "@/pages/Home/components/ChatRoom/components/MessageInput";
import { Send } from "lucide-react";
import classes from "./ChatFooter.module.scss";
import { useActiveChatStore, useMessagesStore } from "@/store";

export function ChatFooter() {
  const activeChat = useActiveChatStore.use.chat();
  const sendMessage = useMessagesStore.use.sendMessage();
  const [messageValue, setMessageValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setMessageValue("");
  }, [activeChat?.id]);

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
    if (event.key === "Enter" && !event.shiftKey) {
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
      <MessageInput
        value={messageValue}
        placeholder="Написать сообщение..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <Button
        icon
        color="primary"
        variant="text"
        className={classes.sendButton}
        type="submit"
      >
        <Send size={26} />
      </Button>
    </form>
  );
}
