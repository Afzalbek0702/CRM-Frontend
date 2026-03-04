import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function RequireAuth({ children }) {
  const { data: user } = useCurrentUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}