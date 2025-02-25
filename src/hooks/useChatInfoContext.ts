import {useContext} from "react";
import { ChatInfoContext } from "@/context/ChatInfoContext.ts";



export function useChatInfoContext() {
  return useContext(ChatInfoContext);
}