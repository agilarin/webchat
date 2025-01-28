import {createBrowserRouter, createHashRouter, RouteObject} from "react-router";
import {Home} from "../pages/Home";
import {AuthPage} from "@/pages/AuthPage";
import {PrivateRoute} from "@/components/PrivateRoute";


const routes: RouteObject[] = [{
    path: "/",
    children: [
      {
        index: true,
        element: <PrivateRoute> <Home/> </PrivateRoute>
      },
      {
        path: "/signin",
        element: <AuthPage type="signin"/>
      },
      {
        path: "/signup",
        element: <AuthPage type="signup"/>
      },
    ]
  }]



export let router = import.meta.env.DEV ? createBrowserRouter(routes) : createHashRouter(routes);



// const paths = {
//   root: "/",
//   signin: "/signin",
//   signup: "/signup",
//
//   router: {
//     root: "/",
//     signin: "/signin",
//     signup: "/signup",
//   }
// }


