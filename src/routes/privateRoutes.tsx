import { RouteObject } from "react-router";
import { ROUTES } from "@/constants";
import { PrivateApp } from "@/components/Layout/PrivateApp";
import { PrivateRoute } from "@/components/Layout/PrivateRoute";
import { Home } from "@/pages/Home";
import { Chat } from "@/pages/Chat";

export const privateRoutes: RouteObject = {
  element: <PrivateRoute />,
  children: [
    {
      element: <PrivateApp />,
      children: [
        {
          path: ROUTES.ROOT,
          element: <Home />,
          children: [
            {
              path: ROUTES.CHAT,
              element: <Chat />,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
