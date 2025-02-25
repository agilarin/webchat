import {useContext} from "react";
import {ChatContext} from "@/context/ChatContext.ts";


export const useChatContext = () => {
  return useContext(ChatContext)
}