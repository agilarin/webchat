import { RouteObject } from "react-router";
import { ROUTES } from "@/constants";
import { AuthLayout } from "@/components/Layout/AuthLayout";
import { Signin } from "@/pages/Signin";
import { Signup } from "@/pages/Signup";

export const authRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: ROUTES.SIGNIN,
      element: <Signin />,
    },
    {
      path: ROUTES.SIGNUP,
      element: <Signup />,
    },
  ],
};
