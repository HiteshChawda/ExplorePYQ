import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/users/current-user`, {
          withCredentials: true,
        });

        console.log("SUCCESS", response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("FAILED", error.response?.data);
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, []);

  if (isLoggedIn === null) {
    return <h2>Loading...</h2>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
