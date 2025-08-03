import { useCurrentUserStore } from "@/store";
import { useShallow } from "zustand/react/shallow";

export function useCurrentUser() {
  return useCurrentUserStore(
    useShallow((state) => {
      if (!state.authUser || !state.userProfile) return null;
      return { ...state.authUser, ...state.userProfile };
    })
  );
}
