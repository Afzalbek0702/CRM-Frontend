import { Navigate } from "react-router-dom";

export default function TenantRedirect() {
  const tenant = localStorage.getItem("tenant");

  if (!tenant) {
     return <Navigate to={`/${tenant}/logi`} />;
  }

  return <Navigate to={`/${tenant}/dashboard`} />;
}