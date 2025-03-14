import {Search} from "@/pages/Home/components/Search";
import {UserAccount} from "@/pages/Home/components/UserAccount";
import {ChatList} from "./components/ChatList";
import classes from "./Sidebar.module.scss"


export function Sidebar() {
  return (
    <div className={classes.sidebarRoot}>
      <div className={classes.userContainer}>
        <UserAccount/>
      </div>
      <div className={classes.content}>
        <Search/>
        <ChatList/>
      </div>
    </div>
  );
}