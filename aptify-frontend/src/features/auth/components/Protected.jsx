import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import { RingLoader } from "react-spinners";

const protectedRoute = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main>
        <RingLoader color="#1c9cdc" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }
  return children;
};

export default protectedRoute;
