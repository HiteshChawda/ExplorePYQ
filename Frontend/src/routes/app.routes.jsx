import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import VerifyOtp from "../features/auth/pages/Verifyotp";
import Home from "../pages/Home";
import PYQs from "../pages/PYQs";
import Post from "../pages/Post";
import ProtectedRoute from "./ProtectedRoutes";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtp />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pyqs",
    element: (
      <ProtectedRoute>
        <PYQs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/post",
    element: (
      <ProtectedRoute>
        <Post />
      </ProtectedRoute>
    ),
  },

  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);
