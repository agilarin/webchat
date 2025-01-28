import {createContext} from "react";
import {User} from "firebase/auth";


interface IAuthContext {
  isLoading: boolean,
  currentUser: User | null,
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: true,
  currentUser: null,
})