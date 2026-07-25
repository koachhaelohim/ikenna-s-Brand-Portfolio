import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthed, loading } = useAuth();
  if (loading) return null;
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}
