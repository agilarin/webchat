import React, {useLayoutEffect, useState} from "react";
import {getAuth, onAuthStateChanged, User} from "firebase/auth";
import {AuthContext} from "@/context/AuthContext.ts";
import {updateUserOnConnection} from "@/services/presenceService.ts";

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useLayoutEffect(() => {
    if  (!user) {
      return;
    }
    const unsub = updateUserOnConnection({userId: user.uid})
    return () => unsub()
  }, [user])


  useLayoutEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsub()
  }, [])


  return (
    <AuthContext.Provider value={{
      isLoading,
      currentUser: user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;