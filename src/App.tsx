import { RouterProvider } from "react-router";
import {router} from "@/routes";
import {AuthProvider} from "@/components/AuthProvider";
import {ChatProvider} from "@/components/ChatProvider";

function App() {

  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router}/>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
