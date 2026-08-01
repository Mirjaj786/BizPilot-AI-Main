import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.js";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(StoreContext);
  const token = localStorage.getItem("bf_token");

  // Strict Authorization: If no token or user in state/localStorage, block access & redirect to login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
