import { create } from "zustand";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { AuthUser, UserProfile } from "@/types";
import { auth } from "@/services/firebase";
import { subscribeToUserProfile as _subscribeToUserProfile } from "@/services/userService";
import { createSelectors } from "@/utils/zustand";

interface CurrentUserState {
  authUser: AuthUser | null;
  authLoading: boolean;
  userProfile: UserProfile | null;
  userProfileLoading: boolean;

  subscribeToUser: () => Unsubscribe;
  subscribeToUserProfile: (userId: string) => Unsubscribe;
}

export const useCurrentUserStoreBase = create<CurrentUserState>((set) => ({
  authUser: null,
  authLoading: true,
  userProfile: null,
  userProfileLoading: true,

  subscribeToUser: () => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      const authUser = firebaseUser && {
        id: firebaseUser.uid,
        email: firebaseUser.email as string,
      };

      set({
        authUser,
        authLoading: false,
      });
    });
  },

  subscribeToUserProfile: (userId) => {
    return _subscribeToUserProfile(userId, async (userProfile) => {
      set({
        userProfile,
        userProfileLoading: false,
      });
    });
  },
}));

export const useCurrentUserStore = createSelectors(useCurrentUserStoreBase);
