import {createBrowserRouter, createHashRouter, RouteObject} from "react-router";
import {Home} from "@/pages/Home";
import {PrivateRoute} from "@/components/PrivateRoute";
import {Signin} from "@/pages/Signin";
import {Signup} from "@/pages/Signup";
import {AuthLayout} from "@/components/AuthLayout";


const routes: RouteObject[] = [{
    path: "/",
    children: [
      {
        index: true,
        element: <PrivateRoute> <Home/> </PrivateRoute>
      },
      {
        path: "/signin",
        element: (
          <AuthLayout>
            <Signin/>
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
          <AuthLayout>
            <Signup/>
          </AuthLayout>
        )
      },
    ]
  }]



export const router = import.meta.env.DEV ? createBrowserRouter(routes) : createHashRouter(routes);



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


