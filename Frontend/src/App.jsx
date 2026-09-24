import { RouterProvider } from "react-router";
import { router } from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <div className="app">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </>
  );
}