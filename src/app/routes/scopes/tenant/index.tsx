import { paths } from "@/config/paths";
import { TenantStatus } from "@/features/tenant/types";
import { useUser } from "@/lib/auth";
import { Redirect } from "@/utils/redirect";
import { Outlet } from "react-router-dom";

const TenantRoot = () => {
  const user = useUser();

  if (user.data?.tenant?.status === TenantStatus.SUSPENDED) {
    return <Redirect to={paths.suspended.route()} />;
  }

  return <Outlet />;
};

export default TenantRoot;
