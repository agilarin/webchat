import {Sidebar} from "@/pages/Home/components/Sidebar";
import {Chat} from "@/pages/Home/components/Chat";
import {ChatInfo} from "@/pages/Home/components/ChatInfo";
import classes from "./Home.module.scss";


export function Home() {

  return (
    <div className={classes.root}>
      <Sidebar/>
      <Chat/>
      <ChatInfo/>
    </div>
  );
}