import { RouterProvider } from "react-router";
import {router} from "@/routes";
import {AuthProvider} from "@/components/AuthProvider";
import {ChatProvider} from "@/components/ChatProvider";
import {ChatInfoProvider} from "@/components/ChatInfoProvider";


function App() {

  return (
    <AuthProvider>
      <ChatProvider>
        <ChatInfoProvider>
          <RouterProvider router={router}/>
        </ChatInfoProvider>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
