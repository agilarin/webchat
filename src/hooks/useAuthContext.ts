import {useContext} from "react";
import {AuthContext} from "@/context/AuthContext.ts";


export function useAuthContext() {
  return useContext(AuthContext);
}