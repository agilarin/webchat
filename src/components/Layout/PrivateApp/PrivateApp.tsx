import { Outlet } from "react-router";
import { UserChatsListener } from "@/components/Logic/UserChatsListener";
import { ReadStatusesListener } from "@/components/Logic/ReadStatusesListener";
import { LastMessagesListener } from "@/components/Logic/LastMessagesListener";
import { UnreadCountListener } from "@/components/Logic/UnreadCountListener";
import { ReadStatusesSaver } from "@/components/Logic/ReadStatusesSaver";
import { useResetChatOnRouteChange } from "@/hooks/store/useResetChatOnRouteChange";
import { UnreadSoundNotifier } from "@/components/Logic/UnreadSoundNotifier";

export function PrivateApp() {
  useResetChatOnRouteChange();

  return (
    <>
      <UserChatsListener />
      <ReadStatusesListener />
      <ReadStatusesSaver />
      <UnreadCountListener />
      <UnreadSoundNotifier />
      <LastMessagesListener />
      <Outlet />
    </>
  );
}
