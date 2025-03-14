import {useLayoutEffect, useState, ReactNode} from "react";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import {UserType} from "@/types";
import {AuthContext} from "@/context/AuthContext.ts";
import {updateUserOnConnection} from "@/services/presenceService.ts";
import userService from "@/services/userService.ts";



interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);


  useLayoutEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if  (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserInfo(null);
      }
      setIsSuccess(true)
    });
    return () => unsub()
  }, [])


  useLayoutEffect(() => {
    if  (!currentUser) {
      return;
    }
    const userId = currentUser.uid;
    const unsubConnect = updateUserOnConnection({userId})
    const unsubUser = userService.subscribeToUser(userId, setUserInfo);

    return () => {
      unsubConnect()
      unsubUser()
    }
  }, [currentUser])


  return (
    <AuthContext.Provider value={{
      isSuccess,
      currentUser,
      userInfo,
    }}>
      {children}
    </AuthContext.Provider>
  );
}