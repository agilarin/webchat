import {createContext} from "react";
import {User} from "firebase/auth";
import {UserType} from "@/types";


interface AuthContextType {
  isLoading: boolean,
  currentUser: User | null,
  userInfo: UserType | null,
}

export const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  currentUser: null,
  userInfo: null
})