import {createBrowserRouter} from "react-router";
import {Home} from "../pages/Home";
import {AuthPage} from "@/pages/AuthPage";
import {PrivateRoute} from "@/components/PrivateRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    // element: <Home/>,
    children: [
      {
        index: true,
        element:
          <PrivateRoute>
            <Home/>
          </PrivateRoute>
      },
      {
        path: "/signin",
        element: <AuthPage type="signin"/>
      },
      {
        path: "/signup",
        element: <AuthPage type="signup"/>
      },

    //   // {
    //   //   path: "/catalog/:pathName",
    //   //   element: <Catalog/>,
    //   // },
    ]
  },
])


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


