import {useContext} from "react";
import {ChatStateContext} from "@/context/ChatStateContext.ts";


export function useChatStateContext() {
  return useContext(ChatStateContext);
}