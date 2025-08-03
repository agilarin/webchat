import {
  createBrowserRouter,
  createHashRouter,
  RouteObject,
} from "react-router";
import { privateRoutes } from "./privateRoutes";
import { authRoutes } from "./authRoutes";

const routes: RouteObject[] = [privateRoutes, authRoutes];

export const router = import.meta.env.DEV
  ? createBrowserRouter(routes)
  : createHashRouter(routes);
