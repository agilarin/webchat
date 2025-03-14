import {useContext} from "react";
import {ChatActionContext} from "@/context/ChatActionContext.ts";


export function useChatActionContext() {
  return useContext(ChatActionContext);
}