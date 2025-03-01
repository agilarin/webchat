import {createContext} from "react";
import {User} from "firebase/auth";
import {UserType} from "@/types";


interface AuthContextType {
  isSuccess: boolean,
  currentUser: User | null,
  userInfo: UserType | null,
}

export const AuthContext = createContext<AuthContextType>({
  isSuccess: true,
  currentUser: null,
  userInfo: null
})