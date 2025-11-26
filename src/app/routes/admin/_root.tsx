import { DashLayout } from "@/components/layouts/_dash-layout";
import { Outlet } from "react-router-dom";

const AdminRoot = () => {
  return (
    <DashLayout>
      <Outlet />
    </DashLayout>
  );
};

export default AdminRoot;
