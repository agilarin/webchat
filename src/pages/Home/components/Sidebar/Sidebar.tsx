import {useEffect, useState} from "react";
import {useAuthContext} from "@/hooks/useAuthContext.ts";
import {ChatType} from "@/types";
import userChatsService from "@/services/userChatsService.ts";
import chatService from "@/services/chatService.ts";
import {Search} from "@/pages/Home/components/Search";
import {ChatsList} from "@/pages/Home/components/ChatsList";
import {UserAccount} from "@/pages/Home/components/UserAccount";
import classes from "./Sidebar.module.scss"


export function Sidebar() {
  const {currentUser} = useAuthContext();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);


  useEffect(() => {
    const userId = currentUser?.uid;
    if (!userId) {
      return;
    }
    const unsub = userChatsService.subscribeToUserChats(userId, (ids) => {
      const promises = ids.map(chatId => chatService.getChat({ chatId, userId }))
      Promise.all(promises).then(setChats)
      setIsSuccess(true)
    });
    return () => unsub();
  }, [currentUser]);


  return (
    <div className={classes.sidebarRoot}>
      <div className={classes.userContainer}>
        <UserAccount/>
      </div>

      <div className={classes.content}>
        <Search/>

        <ChatsList chats={chats} isSuccess={isSuccess}/>
      </div>

    </div>
  );
}