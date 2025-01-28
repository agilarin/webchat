import {useEffect, useState} from "react";
import {useAuthState} from "@/hooks/useAuthState.ts";
import {ChatType} from "@/types";
import chatService from "@/services/chatService.ts";
import {Search} from "@/pages/Home/components/Search";
import {ChatsList} from "@/pages/Home/components/ChatsList";
import {UserAccount} from "@/pages/Home/components/UserAccount";
import classes from "./Sidebar.module.scss"


function Sidebar() {
  const {currentUser} = useAuthState();
  const [chats, setChats] = useState<ChatType[]>([]);


  useEffect(() => {
    const userId = currentUser?.uid;
    if (!userId) {
      return;
    }
    const unsub = chatService.subscribeToUserChats({ userId }, (ids) => {
      const promises = ids.map(chatId => chatService.getChat({ chatId, userId }))
      Promise.all(promises).then(setChats)
    });
    return () => unsub();
  }, [currentUser]);


  return (
    <div className={classes.root}>
      <div className={classes.userContainer}>
        <UserAccount/>
      </div>

      <div className={classes.content}>
        <Search/>

        <ChatsList chats={chats}/>
      </div>

    </div>
  );
}

export default Sidebar;