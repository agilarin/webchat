import { Navigate, Outlet } from "react-router";
import { useCurrentUserStore } from "@/store";
import { ROUTES } from "@/constants";

export function PrivateRoute() {
  const authUser = useCurrentUserStore.use.authUser();

  if (authUser) {
    return <Outlet />;
  }

  return (
    <Navigate
      to={ROUTES.SIGNIN}
      state={{
        from: {
          pathname: location.pathname,
          search: location.search,
        },
      }}
      replace
    />
  );
}
