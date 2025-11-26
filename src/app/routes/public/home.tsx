import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useUser } from "@/lib/auth";
import { Logger } from "@/utils/logger";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUser();
  Logger.info(user);
  
  return (
    <div>
      Home Page
      <Button onClick={() => toast({ title: "Test" , type: "success" })}>Test</Button>
      <Button onClick={() => navigate(paths.login.root)}>Login</Button>
      <Button onClick={() => navigate("/admin/" + paths.admin.dashboard.root)}>Dashboard</Button>
    </div>
  );
};
export default HomePage;
