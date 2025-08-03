import { Outlet } from "react-router";
import { UserChatsListener } from "@/components/Logic/UserChatsListener";
import { ReadStatusesListener } from "@/components/Logic/ReadStatusesListener";
import { LastMessagesListener } from "@/components/Logic/LastMessagesListener";
import { UnreadCountListener } from "@/components/Logic/UnreadCountListener";
import { ReadStatusesSaver } from "@/components/Logic/ReadStatusesSaver";

export function PrivateApp() {
  return (
    <>
      <UserChatsListener />
      <ReadStatusesListener />
      <ReadStatusesSaver />
      <UnreadCountListener />
      <LastMessagesListener />
      <Outlet />
    </>
  );
}
