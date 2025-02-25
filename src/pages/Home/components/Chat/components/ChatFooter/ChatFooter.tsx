import React, {useEffect, useRef, useState} from "react";
import chatService from "@/services/chatService.ts";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {useChatContext} from "@/hooks/useChatContext.ts";
import {Button} from "@/components/UI/Button";
import classes from "./ChatFooter.module.scss";
import PaperPlaneIcon from "@/assets/icons/paper-plane.svg?react";



function ChatFooter() {
  const {currentUser} = useAuthContext();
  const {currentChat, setCurrentChat, isCreated} = useChatContext();
  const [messageValue, setMessageValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageValue]);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentChat || !currentUser?.uid || messageValue === "") {
      return;
    }
    let chat = currentChat;
    if (isCreated.current) {
      chat = await chatService.createChat({data: currentChat, userId: currentUser.uid});
      setCurrentChat(chat);
      isCreated.current = false
    }
    chatService.sendMessage({
      chatId: chat?.id,
      userId: currentUser.uid,
      message: messageValue
    });
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
    <form ref={formRef} className={classes.root} onSubmit={handleSubmit}>

      <textarea
        ref={textareaRef}
        className={classes.input}
        placeholder="Написать сообщение..."
        value={messageValue}
        onChange={handleChange}
        rows={1}
        onKeyDown={handleKeyDown}
      />

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

export default ChatFooter;