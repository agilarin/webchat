import { useEffect, PropsWithChildren } from "react";
import { useCurrentUserStore } from "@/store";

export function AuthProvider({ children }: PropsWithChildren) {
  const authUser = useCurrentUserStore.use.authUser();
  const authLoading = useCurrentUserStore.use.authLoading();
  const subscribeToUser = useCurrentUserStore.use.subscribeToUser();

  const subscribeToUserProfile =
    useCurrentUserStore.use.subscribeToUserProfile();

  useEffect(() => {
    const unsub = subscribeToUser();
    return () => unsub();
  }, [subscribeToUser]);

  useEffect(() => {
    if (!authUser?.id) return;
    const unsub = subscribeToUserProfile(authUser.id);
    return () => unsub();
  }, [subscribeToUserProfile, authUser?.id]);

  if (authLoading) return null;

  return children;
}
