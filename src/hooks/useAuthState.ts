import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext.ts";


export function useAuthState() {
  return useContext(AuthContext);
}