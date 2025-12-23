import { paths } from "@/config/paths";
import { TenantStatus } from "@/features/tenant/types";
import { useUser } from "@/lib/auth";
import { Navigate, Outlet } from "react-router-dom";

const TenantRoot = () => {
  const user = useUser();

  if (user.data?.tenant?.status === TenantStatus.SUSPENDED) {
    return <Navigate to={paths.suspended.route()} />;
  }
  

  return <Outlet />;
};

export default TenantRoot;
