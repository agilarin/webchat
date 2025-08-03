import { Navigate, Outlet } from "react-router";
import { useCurrentUserStore } from "@/store";
import classes from "./AuthLayout.module.scss";

export function AuthLayout() {
  const authUser = useCurrentUserStore.use.authUser();

  if (authUser) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <div className={classes.authLayoutRoot}>
      <div className={classes.container}>
        <Outlet />
      </div>
    </div>
  );
}
