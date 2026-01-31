import { Button } from "@/components/ui/button";
import { SwitchLanguage } from "@/components/ui/language/switch-language";
import { RouterLink } from "@/components/ui/link";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  
  
  return (
    <div>
      Home Page
      <Button onClick={() => toast({ title: "Test", type: "success" })}>
        Test
      </Button>
      <SwitchLanguage />
      <Button onClick={() => navigate(paths.login.root)}>Login</Button>
      <RouterLink
        to={paths.admin.dashboard.route()}
        className="text-primary-foreground"
      >
        Dashnoard
      </RouterLink>
      <Button onClick={() => navigate(paths.register.route(""))}>
        Register
      </Button>
      <Button
        onClick={() => {
          logout.mutate({});
        }}
      >
        <span>Logout</span>
      </Button>
    </div>
  );
};
export default HomePage;
