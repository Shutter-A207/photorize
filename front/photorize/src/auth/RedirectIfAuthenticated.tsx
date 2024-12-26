import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
