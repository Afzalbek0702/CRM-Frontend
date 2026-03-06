import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function TenantRedirect() {
   const { tenant } = useCurrentUser();

  if (!tenant) {
     return <Navigate to={`/${tenant}/logi`} />;
  }

  return <Navigate to={`/${tenant}/dashboard`} />;
}