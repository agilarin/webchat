import { useContext } from "react";
import {UserChatsContext} from "@/context/UserChatsContext.ts";


export function useUserChatsContext() {
  return useContext(UserChatsContext);
}