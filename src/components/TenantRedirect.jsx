import { Navigate, useParams } from "react-router-dom";

export default function TenantRedirect() {
   const { tenant } = useParams();

  if (!tenant) {
     return <Navigate to={`/${tenant}/logi`} />;
  }

  return <Navigate to={`/${tenant}/dashboard`} />;
}