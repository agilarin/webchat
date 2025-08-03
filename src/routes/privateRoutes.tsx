import { RouteObject } from "react-router";
import { ROUTES } from "@/constants";
import { PrivateApp } from "@/components/Layout/PrivateApp";
import { PrivateRoute } from "@/components/Layout/PrivateRoute";
import { Home } from "@/pages/Home";

export const privateRoutes: RouteObject = {
  path: ROUTES.ROOT,
  element: <PrivateRoute />,
  children: [
    {
      element: <PrivateApp />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        // {
        //   path: ROUTES.CHAT,
        //   element: <ChatLayout />,
        // }
      ],
    },
  ],
};
