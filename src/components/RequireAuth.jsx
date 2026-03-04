import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function RequireAuth({ children }) {
  const { data: user } = useCurrentUser();
  const tenant = localStorage.getItem("tenant")
  if (!user) {
    return <Navigate to={`/${tenant}/login`} />;
  }

  return children;
}