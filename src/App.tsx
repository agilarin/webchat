import { RouterProvider } from "react-router";
import {router} from "@/routes";
import {AuthProvider} from "@/components/Providers/AuthProvider";
import {ChatProvider} from "@/components/Providers/ChatProvider";
import {ChatInfoProvider} from "@/components/Providers/ChatInfoProvider";


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
