import { RouterProvider } from "react-router";
import {router} from "@/routes";
import {AuthProvider} from "@/components/Providers/AuthProvider";
import {ChatProvider} from "@/components/Providers/ChatProvider";
import {ChatStateProvider} from "@/components/Providers/ChatStateProvider";
import {ChatActionProvider} from "@/components/Providers/ChatActionProvider";
import {UserChatsProvider} from "@/components/Providers/UserChatsProvider";


function App() {

  return (
    <AuthProvider>
      <UserChatsProvider>
        <ChatProvider>
        <ChatStateProvider>
          <ChatActionProvider>
            <RouterProvider router={router}/>
          </ChatActionProvider>
        </ChatStateProvider>
        </ChatProvider>
      </UserChatsProvider>
    </AuthProvider>
  )
}

export default App
