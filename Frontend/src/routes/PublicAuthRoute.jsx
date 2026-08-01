import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.js";

export default function PublicAuthRoute({ children }) {
  const { user } = useContext(StoreContext);
  const token = localStorage.getItem("bf_token");

  // If user is already authenticated, redirect them directly to the dashboard
  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
