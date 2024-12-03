import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

interface AdminProtectedRouteProps {
  element: React.ReactElement;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({
  element,
}) => {
  const { user } = useContext(UserContext);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default AdminProtectedRoute;
