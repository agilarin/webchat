import { RouterProvider } from "react-router";
import { router } from "@/routes";
import { AuthProvider } from "@/components/Providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
