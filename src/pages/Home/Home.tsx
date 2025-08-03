import { Resizable, ResizableProps } from "re-resizable";
import { useMediaQuery } from "@/hooks/useMediaQuery.ts";
import { Sidebar } from "@/pages/Home/components/Sidebar";
import { ChatRoom } from "@/pages/Home/components/ChatRoom";
import classes from "./Home.module.scss";

export function Home() {
  const matches = useMediaQuery("(min-width: 768px)");
  let resizableProps: ResizableProps = {
    size: { width: "100%" },
    enable: false,
  };

  if (matches) {
    resizableProps = {
      defaultSize: { width: "25%" },
      enable: { right: true },
      minWidth: 280,
      maxWidth: "50%",
    };
  }

  return (
    <div className={classes.root}>
      <Resizable {...resizableProps}>
        <Sidebar />
      </Resizable>
      <ChatRoom />
    </div>
  );
}
