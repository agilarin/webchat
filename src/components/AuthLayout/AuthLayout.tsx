import { ReactNode } from "react";
import classes from "./AuthLayout.module.scss";


interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={classes.authLayoutRoot}>
      <div className={classes.container}>
        {children}
      </div>
    </div>
  );
}