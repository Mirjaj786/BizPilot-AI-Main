import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(StoreContext);
  return user ? children : <Navigate to="/login" replace />;
}
